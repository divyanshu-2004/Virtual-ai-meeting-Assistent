from flask import Flask, request, jsonify
import re
import spacy
from transformers import pipeline
import yake
  
nlp = spacy.load("en_core_web_sm")
summarizer = pipeline("summarization", model="facebook/bart-large-cnn")

app = Flask(__name__)

def parse_transcript(text):
    speaker_data = re.findall(r'(\w+): (.*?)\n', text, re.DOTALL)
    return [{"speaker": s, "text": t.strip()} for s, t in speaker_data]

def extract_action_items(text):
    action_keywords = ["will", "shall", "going to", "can you", "need to", "I’ll", "I'll"]
    doc = nlp(text)
    return [sent.text for sent in doc.sents if any(kw in sent.text for kw in action_keywords)]

def extract_keywords(text, max_keywords=5):
    kw_extractor = yake.KeywordExtractor(top=max_keywords)
    return [kw for kw, _ in kw_extractor.extract_keywords(text)]

def generate_summary(text):

    if len(text.split()) < 50:
        return text
    return summarizer(text, max_length=100, min_length=30, do_sample=False)[0]['summary_text']

def process_meeting(transcript):
    parsed = parse_transcript(transcript)
    all_text = " ".join([entry["text"] for entry in parsed])
    notes = [f"{entry['speaker']}: {entry['text']}" for entry in parsed]
    return {
        "notes": notes,
        "action_items": extract_action_items(all_text),
        "summary": generate_summary(all_text),
        "keywords": extract_keywords(all_text)
    }

@app.route('/process', methods=['POST'])
def process():
    data = request.get_json()
    transcript = data.get("transcript", "")
    if not transcript:
        return jsonify({"error": "Transcript missing"}), 400
    result = process_meeting(transcript)
    return jsonify(result)

if __name__ == '_main_':
    app.run(debug=True)