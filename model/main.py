import torch
import numpy as np
import pandas as pd
from sentence_transformers import SentenceTransformer, util
from fastapi import FastAPI, Query
from fastapi.middleware.cors import CORSMiddleware

# 개발자 모드로 인한 에러를 방지하기 위한 조치
import os
os.environ["HF_HUB_DISABLE_SYMLINKS_WARNING"] = "1"

app = FastAPI()

# CORS 설정 추가
origins = [
    "http://localhost:3000",  # React 개발 서버 주소
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# 모델과 데이터를 전역 변수로 불러오기
model = SentenceTransformer('snunlp/KR-SBERT-V40K-klueNLI-augSTS')
skchat_final_embedding_data = torch.load('C:\\Users\\a\\Desktop\\NLP\\QnA_pt\\SKChat_final_embedding_data_tensor.pt')
skchatdata = pd.read_csv("C:\\Users\\a\\Desktop\\NLP\\QnA_pt\\SK_finalData.csv")

@app.get("/model")
async def question(question: str = Query(..., description="The question to the chatbot")):
    # 예시 질문 인코딩 후 텐서화
    question_encode = model.encode(question)
    question_encode_np = np.array(question_encode, dtype=np.float32)
    question_encode_tensor = torch.tensor(question_encode_np)

    # 저장된 임베딩 데이터와 예시 질문의 코사인 유사도 측정
    cos_similar = util.cos_sim(question_encode_tensor, skchat_final_embedding_data)

    # 코사인 유사도가 높은 선택된 질문
    Chat_simliar_idx = int(np.argmax(cos_similar))
    Query_similar = skchatdata['Q'][Chat_simliar_idx]

    # 유사도가 높아 선택된 질문 인코딩
    Query_similar_encode = model.encode(Query_similar)

    # 유사도 점수 측정
    cos_score = np.dot(question_encode_tensor, Query_similar_encode) / (np.linalg.norm(question_encode_tensor) * np.linalg.norm(Query_similar_encode))

    if cos_score < 0.7:
        return {"message": f"질문을 정확하게 이해하지 못했습니다. 좀 더 자세하게 설명해주신다면 원하시는 답변을 찾아드리겠습니다."}
    else:
        answer = skchatdata['A'][Chat_simliar_idx]
        return {"answer": answer}
