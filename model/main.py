import torch
import numpy as np
import pandas as pd
from sentence_transformers import SentenceTransformer, util
from fastapi import FastAPI, Query, HTTPException
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
sk_embedding_data = torch.load('C:\\Users\\a\\Desktop\\NLP\\QnA_pt\\sk_embedding_data_tensor.pt')
skChatData = pd.read_excel("C:\\Users\\a\\Desktop\\NLP\\QnA_pt\\SKChatData.xlsx")
gen_embedding_data = torch.load('C:\\Users\\a\\Desktop\\NLP\\QnA_pt\\gen_embedding_data_tensor.pt')
genChatData = pd.read_csv("C:\\Users\\a\\Desktop\\NLP\\QnA_pt\\gen_ChatData.csv")

# 사용자 응답에 따른 질문과 답변을 저장
state = {}
lastState = {}

@app.get("/model")
async def question(question: str = Query(..., description="The question to the chatbot")):
    # 예시 질문 인코딩 후 텐서화
    question_encode = model.encode(question)
    question_encode_np = np.array(question_encode, dtype=np.float32)
    question_encode_tensor = torch.tensor(question_encode_np)

    # 저장된 임베딩 데이터와 예시 질문의 코사인 유사도가 비슷한 텐서값
    # sk_embedding_data / gen_embedding_data
    sk_cos_similar = util.cos_sim(question_encode_tensor, sk_embedding_data)
    gen_cos_similar = util.cos_sim(question_encode_tensor, gen_embedding_data)

    # 서경챗봇 코사인 유사도가 높은 인덱스값과 질문(skChatData)
    skChat_simliar_idx = int(np.argmax(sk_cos_similar))
    sk_Query_similar = skChatData['Q'][skChat_simliar_idx]
    # 일반챗봇 코사인 유사도가 높은 인덱스값과 질문(genChatData)
    genChat_simliar_idx = int(np.argmax(gen_cos_similar))
    gen_Query_similar = genChatData['Q'][genChat_simliar_idx]

    # 서경챗봇 유사도가 높아 선택된 질문 인코딩
    sk_Query_similar_encode = model.encode(sk_Query_similar)
    # 일반챗봇 유사도가 높아 선택된 질문 인코딩
    gen_Query_similar_encode = model.encode(gen_Query_similar)

    # 챗봇 유사도 점수 측정
    sk_cos_score = np.dot(question_encode_tensor, sk_Query_similar_encode) / (np.linalg.norm(question_encode_tensor) * np.linalg.norm(sk_Query_similar_encode))
    gen_cos_score = np.dot(question_encode_tensor, gen_Query_similar_encode) / (np.linalg.norm(question_encode_tensor) * np.linalg.norm(gen_Query_similar_encode))

    if (sk_cos_score >= 0.84):
        sk_Answer = skChatData['A'][skChat_simliar_idx]
        return {"answer" : sk_Answer}
    elif (sk_cos_score < 0.84 and sk_cos_score >= 0.62):
        sk_Answer = skChatData['A'][skChat_simliar_idx]
        state['answer'] = sk_Answer
        state['sk_cos_score'] = sk_cos_score
        state['sk_cos_similar'] = sk_cos_similar
        state['question_encode_tensor'] = question_encode_tensor
        return {"answer" : f"혹시 궁금하신 내용이 \"{sk_Query_similar}\"에 대한 내용이 맞나요?"}
    elif (sk_cos_score < 0.62 and gen_cos_score >= 0.6):
        gen_Answer = genChatData['A'][genChat_simliar_idx]
        return {"answer" : gen_Answer}
    else:
        return {"answer" : "질문을 정확하게 이해하지 못했습니다.\n좀 더 자세하게 설명해주신다면 원하시는 답변을 찾아드리겠습니다."}


@app.get("/response")
async def user_response(user_response: str = Query(..., description="User's response to the chatbot")):
    if 'answer' not in state or 'sk_cos_score' not in state or 'sk_cos_similar' not in state or 'question_encode_tensor' not in state:
        raise HTTPException(status_code=400, detail="No answer in progress")

    if user_response == '예':
        # '예' 응답 처리 로직
        return {"answer": {state['answer']}}

    elif user_response == '아니오':
        # '아니오' 응답 처리 로직
        sk_sec_similar = state['sk_cos_score'] - 0.14
        # 두번째로 높은 코사인 유사도에 해당하는 인덱스 찾기
        skChat_sec_simliar_idx = int(np.argmax(state['sk_cos_similar'] >= sk_sec_similar))
        sk_sec_Query_similar = skChatData['Q'][skChat_sec_simliar_idx]

        # 서경챗봇 유사도가 두번째로 높아 선택된 질문 인코딩
        sk_Query_sec_similar_encode = model.encode(sk_sec_Query_similar)
        sk_sec_cos_score = np.dot(state['question_encode_tensor'], sk_Query_sec_similar_encode) / (np.linalg.norm(state['question_encode_tensor']) * np.linalg.norm(sk_Query_sec_similar_encode))
        # 두번쩨 답변
        sk_sec_Answer = skChatData['A'][skChat_sec_simliar_idx]
        if (sk_sec_cos_score >= 0.62):
            lastState['sk_sec_Answer'] = sk_sec_Answer
            return {"answer" : f"그렇다면 궁금하신 내용이 \"{sk_sec_Query_similar}\"에 대한 내용이 맞나요?"}
        else:
            return {"answer" : "제가 제공하는 내용 중 해당하지 않거나 구체적이지 않은, 혹은 답할 수 없는 질문입니다. [질문 요청하기] 버튼을 통해 원하는 질문을 알려주세요."}

    elif user_response != '예' and user_response != '아니오':
        return {"answer" : "예 또는 아니오 로만 응답해주세요."}

@app.get("/secResponse")
async def user_secResponse(user_response: str = Query(..., description="User's response to the chatbot")):
    if 'sk_sec_Answer' not in lastState:
        raise HTTPException(status_code=400, detail="No answer in progress")

    if user_response == '예':
        # '예' 응답 처리 로직
        return {"answer": {lastState['sk_sec_Answer']}}

    elif user_response == '아니오':
        return {"answer" : "제가 제공하는 내용 중 해당하지 않거나 구체적이지 않은, 혹은 답할 수 없는 질문입니다. [질문 요청하기] 버튼을 통해 원하는 질문을 알려주세요."}

    elif user_response != '예' and user_response != '아니오':
        return {"answer" : "예 또는 아니오 로만 응답해주세요."}