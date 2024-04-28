import pandas as pd
import json
from sklearn.model_selection import train_test_split
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.svm import SVC
from sklearn.linear_model import LogisticRegression
from sklearn.ensemble import VotingClassifier
from sklearn.metrics import accuracy_score, classification_report
from nltk.stem import PorterStemmer
from nltk.corpus import stopwords
import pickle
from imblearn.over_sampling import RandomOverSampler

stop_words = set(stopwords.words('english'))
stemmer = PorterStemmer()

def load_profanity_words():
    """ Load profanity words dataset"""
    with open('api/static/assets/profanity_words.json') as f:
        profanity_data = json.load(f)
    return set(profanity_data)

def load_dataset():
    """ Load Hate Speech and Offensive Language Twitter Dataset """
    df = pd.read_csv('static/assets/hate_speech_dataset.csv')
    return df

def preprocess_text(text, profanity_words):
    """ Converts word to lowercase, removes stopwords and reducing words to their base form, adding weight to profanity words """
    words = [stemmer.stem(word) for word in text.split() if not word.lower() in stop_words]
    weighted_words = []
    for word in words:
        if word.lower() in profanity_words:
            weighted_words.extend([word] * 2)
        else:
            weighted_words.append(word)
    return ' '.join(weighted_words)

def evaluate_model(df, model, tfidf_vectorizer):
    """ Train and evaluate the model """
    # Preprocess the text
    df['processed_text'] = df['tweet'].apply(lambda x: preprocess_text(x, profanity_words))

    # Balance the classes using oversampling because classes have mixed samples
    ros = RandomOverSampler(random_state=42)
    X_resampled, y_resampled = ros.fit_resample(df['processed_text'].values.reshape(-1, 1), df['class'])

    # Split the resampled data into train and test sets
    X_train, X_test, y_train, y_test = train_test_split(X_resampled, y_resampled, test_size=0.2, random_state=42)

    # Vectorize the text data
    X_train_tfidf = tfidf_vectorizer.fit_transform(X_train.ravel())
    X_test_tfidf = tfidf_vectorizer.transform(X_test.ravel())

    # Train the model
    model.fit(X_train_tfidf, y_train)

    # Predict with the model
    y_pred = model.predict(X_test_tfidf)

    # Evaluate the model
    accuracy = accuracy_score(y_test, y_pred)
    report = classification_report(y_test, y_pred)

    return accuracy, report

def predict_hate_speech(sentence, model, tfidf_vectorizer):
    """ Used in views.py for predicting whether user input should be filtered """
    profanity_words = load_profanity_words()

    # Check if any profane word is in the text and classify as offensive
    if any(word.lower() in profanity_words for word in sentence.split()):
        return 1
    
    # List of words that may be commonly misclassified
    commonly_misclassified_words = ['omg'] 

    # Remove commonly misclassified words from the sentence for the check
    words = sentence.split()
    sentence_without_common_words = ' '.join(word for word in words if word.lower() not in commonly_misclassified_words)

    # Preprocess both versions of the sentence
    processed_sentence = preprocess_text(sentence, profanity_words)
    processed_sentence_without_common_words = preprocess_text(sentence_without_common_words, profanity_words)

    # Vectorize both versions of the sentence
    X_sentence_tfidf = tfidf_vectorizer.transform([processed_sentence])
    X_sentence_without_common_words_tfidf = tfidf_vectorizer.transform([processed_sentence_without_common_words])

    # Predict with the model for both versions
    prediction = model.predict(X_sentence_tfidf)
    prediction_without_common_words = model.predict(X_sentence_without_common_words_tfidf)
    
    # If the sentence is only offensive with the commonly misclassified words, override the prediction
    if prediction[0] != prediction_without_common_words[0] and prediction_without_common_words[0] == 2:
        return 2  # Return class label for 'neither'

    return prediction[0]  # Return the predicted class label

def save_model_and_vectorizer(model, vectorizer):
    with open('filter.pkl', 'wb') as f:
        pickle.dump((model, vectorizer), f)

def load_model_and_vectorizer():
    with open('api/filter.pkl', 'rb') as f:
        model, vectorizer = pickle.load(f)
    return model, vectorizer

if __name__ == "__main__":
    profanity_words = load_profanity_words()
    df = load_dataset()

    # Initialize TF-IDF Vectorizer
    tfidf_vectorizer = TfidfVectorizer(max_features=5000) 

    # Train an ensemble of classifiers (Logistic Regression, SVM)
    clf1 = LogisticRegression(max_iter=1000, random_state=42)
    clf2 = SVC(kernel='linear', C=0.5, probability=True, random_state=42)
    
    model = VotingClassifier(estimators=[('lr', clf1), ('svm', clf2)], voting='soft')
    accuracy, report = evaluate_model(df, model, tfidf_vectorizer)
    print(f"Accuracy: {accuracy:.2f}")
    print(f"Classification Report:\n{report}")

    save_model_and_vectorizer(model, tfidf_vectorizer)
    loaded_model, loaded_vectorizer = load_model_and_vectorizer()

    # Offensive content to test the model
    test_sentences = [
        "This is a harmless sentence.",
        "Fucking bitch rat ass hoe.",
        "what the actual fck",
        "omgggg b1tch no way",
        "go kill yourself",
        "that is gorgeous babe",
        "what an ugly ass babe",
        "what if we all just went extinct in two days?",
        "Did you know that his fucking dad was the pope?",
        "Please meet my chinky friend.",
        "omgggggggg"
    ]

    for sentence in test_sentences:
        print(f"Sentence: {sentence}")
        print("Prediction:", predict_hate_speech(sentence, loaded_model, loaded_vectorizer))
        print()
