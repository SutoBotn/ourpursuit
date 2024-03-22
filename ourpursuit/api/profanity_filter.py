from sklearn.ensemble import VotingClassifier
from sklearn.linear_model import LogisticRegression
from sklearn.svm import SVC
from sklearn.metrics import accuracy_score, confusion_matrix, classification_report
from sklearn.model_selection import train_test_split
from sklearn.feature_extraction.text import TfidfVectorizer

from nltk.stem import PorterStemmer

import matplotlib.pyplot as plt
import json
import string
import pickle

def load_data():
    with open("static/assets/profanity_words.json", 'r') as file:
        profanity_words = json.load(file)

    with open('static/assets/non_profanity_words.txt', 'r') as file:
        non_profanity_words = file.read().splitlines()

    # 1 indicates profanity and 0 indicates non-profanity
    data = profanity_words + non_profanity_words
    labels = [1] * len(profanity_words) + [0] * len(non_profanity_words)

    return data, labels

def preprocess_data(data):
    # Make the words lowercase and remove punctuation
    if isinstance(data, list):
        preprocessed_data = [word.lower().translate(str.maketrans('', '', string.punctuation)) for word in data]
    else:
        text = data.split()
        preprocessed_data = [word.lower().translate(str.maketrans('', '', string.punctuation)) for word in text]

    # Stemming - getting root word
    stemmer = PorterStemmer()
    preprocessed_data = [' '.join([stemmer.stem(word) for word in text.split()]) for text in preprocessed_data]

    return preprocessed_data

def train_data(preprocessed_data, labels):
    # Vectorization
    vectorizer = TfidfVectorizer(ngram_range=(1, 2))
    X = vectorizer.fit_transform(preprocessed_data)

    # Split the data into train and test sets
    X_train, X_test, y_train, y_test = train_test_split(X, labels, test_size=0.2, random_state=42)

    # Train an ensemble of classifiers (Logistic Regression, SVM)
    clf1 = LogisticRegression(max_iter=1000, random_state=42)
    clf2 = SVC(kernel='linear', C=0.5, probability=True, random_state=42)
    
    ensemble_clf = VotingClassifier(estimators=[('lr', clf1), ('svm', clf2)], voting='soft')
    ensemble_clf.fit(X_train, y_train)
    
    return ensemble_clf, X_test, y_test, vectorizer

def evaluate_model(model, X_test, y_test):
    # Make predictions
    y_pred = model.predict(X_test)

    # Evaluate accuracy
    accuracy = accuracy_score(y_test, y_pred)
    print(f"Accuracy: {accuracy:.2f}")

    # Confusion matrix
    cm = confusion_matrix(y_test, y_pred)
    print("Confusion Matrix:")
    print(cm)

    # Classification report
    report = classification_report(y_test, y_pred)
    print("Classification Report:")
    print(report)

    # Visualising confusion matrix
    plt.figure(figsize=(6, 4))
    plt.imshow(cm, interpolation='nearest', cmap=plt.cm.Blues)
    plt.title("Confusion Matrix")
    plt.colorbar()
    plt.xlabel("Predicted Label")
    plt.ylabel("True Label")
    plt.xticks([0, 1], ["Non-Profanity", "Profanity"])
    plt.yticks([0, 1], ["Non-Profanity", "Profanity"])
    plt.show()

# Save the profanity filter model and vectorizer
def save_profanity_filter_model(model, vectorizer):
    with open("profanity_model.pkl", 'wb') as file:
        pickle.dump((model, vectorizer), file)

# Load the profanity filter model and vectorizer
def load_profanity_filter_model():
    with open("api/profanity_model.pkl", 'rb') as file:
        model, vectorizer = pickle.load(file)
    return model, vectorizer

def contains_profanity(text, trained_model, vectorizer):
    preprocessed = preprocess_data([text])
    preprocessed_vectorized = vectorizer.transform(preprocessed)
    return trained_model.predict(preprocessed_vectorized)[0] == 1

if __name__ == "__main__":
    data, labels = load_data()
    preprocessed_data = preprocess_data(data)
    trained_model, X_test, y_test, vectorizer = train_data(preprocessed_data, labels)
    evaluate_model(trained_model, X_test, y_test)
    save_profanity_filter_model(trained_model, vectorizer)