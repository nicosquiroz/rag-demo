from sentence_transformers import SentenceTransformer, util

class RAGPipeline:
    def __init__(self, embedding_model_name='all-MiniLM-L6-v2'):
        self.model = SentenceTransformer(embedding_model_name)

    def chunk_document(self, text, chunk_size=400):
        # Simple chunking by character count (customize as needed)
        return [text[i:i+chunk_size] for i in range(0, len(text), chunk_size)]

    def embed_chunks(self, chunks):
        return self.model.encode(chunks, convert_to_tensor=True)

    def embed_query(self, query):
        return self.model.encode(query, convert_to_tensor=True)

    def search(self, query, chunks, chunk_embeddings, top_k=3):
        query_embedding = self.embed_query(query)
        cos_scores = util.pytorch_cos_sim(query_embedding, chunk_embeddings)[0]
        top_results = cos_scores.topk(top_k)
        return [(chunks[idx], float(score)) for score, idx in zip(top_results[0], top_results[1])]

    def process(self, text, query):
        chunks = self.chunk_document(text)
        chunk_embeddings = self.embed_chunks(chunks)
        top_chunks = self.search(query, chunks, chunk_embeddings)
        return top_chunks
    

def process_pdf(file):
    # Your RAG logic here
    return "# Python code extracted from PDF\n a+b+c"