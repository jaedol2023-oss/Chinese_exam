# 중국어 시험 생성기

## 실행 방법

```bash
cd ~/Documents/외국어/중국어/chinese-exam
npm install                    # 최초 1회
export ANTHROPIC_API_KEY="sk-ant-여기에키" && npm start
```

브라우저에서 http://localhost:3000 접속

## 기능
- 📸 이미지 OCR (Claude API) — 단어장 사진에서 자동 추출
- ✏️ 텍스트 직접 입력 (탭/쉼표/공백 구분 자동 인식)
- ➕ 누적 추가 (기존 데이터에 추가됨, 덮어쓰기 X)
- 📋 등록 목록 보기/개별 삭제
- 🤖 AI 문장 자동 생성 (등록된 단어 조합)
- 📝 시험지 생성 (양방향 출제)
- 🖨 인쇄 기능
