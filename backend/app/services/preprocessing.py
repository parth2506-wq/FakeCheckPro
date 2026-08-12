import re
import nltk
from nltk.corpus import stopwords
from nltk.stem import WordNetLemmatizer

# Initialize NLTK tools (ensure corpora are downloaded at startup)
try:
    stop_words = set(stopwords.words('english'))
except LookupError:
    nltk.download('stopwords')
    stop_words = set(stopwords.words('english'))

try:
    lemmatizer = WordNetLemmatizer()
    lemmatizer.lemmatize('test') # dummy call to trigger load
except LookupError:
    nltk.download('wordnet')
    nltk.download('omw-1.4')
    lemmatizer = WordNetLemmatizer()

def preprocess_text(text: str) -> str:
    """
    Cleans and preprocesses the text following the exact pipeline used during model training.
    """
    text = str(text)

    # 1. Convert text to lowercase
    text = text.lower()

    # 2. Remove URLs
    text = re.sub(r"http\S+|www\S+|https\S+", " ", text)

    # 3. Remove HTML tags
    text = re.sub(r"<.*?>", " ", text)

    # 4. Remove non-alphabetic characters
    text = re.sub(r"[^a-z\s]", " ", text)

    # 5. Normalize whitespace
    text = re.sub(r"\s+", " ", text).strip()

    # 6. Tokenize using whitespace splitting
    tokens = text.split()

    # 7. Remove English stopwords
    tokens = [word for word in tokens if word not in stop_words]

    # 8. Apply WordNet lemmatization
    tokens = [lemmatizer.lemmatize(word) for word in tokens]

    # 9. Join tokens back into a string
    return " ".join(tokens)
