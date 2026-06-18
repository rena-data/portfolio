# Portfolio Web | 이기쁨

AX 엔지니어 · AI 자동화 포트폴리오 (웹 버전)

**Live:** https://rena-data.github.io/portfolio/

---

## Work · 실무 (4개 대형 광고주 · 1인 개발)

| # | 영역 | 설명 | 기술 |
|---|------|------|------|
| W1 | **네이버 검색광고 API 자동화** | 리포트 자동 다운로드·병합 + 소재·키워드 대량 CRUD + 입찰가·세그먼트 일괄 변경(예약) | FastAPI, 네이버 광고 API, asyncio, Streamlit |
| W2 | **웹 크롤링·경쟁사/시장 분석** | 자사·경쟁사 베스트 상품, 방송 편성 상품, 키워드 노출 이미지 수집 | Selenium, Playwright, BeautifulSoup, requests |
| W3 | **운영·안정화·데이터 정합성** | 스케줄러 운영, 카카오 토큰 재발급, 정합성 점검·재적재, 장애 핫픽스 | Python, asyncio, PostgreSQL, 스케줄러 |

> 사기업 작업물이라 광고주명·사내 데이터·화면은 익명화 및 샘플/목업으로 재구성.

## 개인 프로젝트

| # | 프로젝트 | 설명 | 기술 |
|---|---------|------|------|
| 01 | **Fintech Intelligence** | 소규모 핀테크 경영 인텔리전스 시스템 (MVP) | Python, DuckDB, Streamlit, n8n |
| 02 | **Beauty AI Analyze** | AI 퍼스널컬러 분석 & 뷰티/패션 추천 ([Live](https://beauty-ai-analyze.onrender.com)) | FastAPI, Gemini API, Supabase, Kakao SDK |
| 03 | **Raising Pet** | 상태 머신 기반 펫 키우기 게임 (MVP) | Python, JavaScript, SVG, pytest |
| 04 | **Fin Scraper** | 국내 전종목(4,000+) HTTP 크롤링 + 투자지표 스크리닝 (KRX 차단 → 네이버 금융 피벗) | Python, requests, BeautifulSoup, PyCryptodome |
| 05 | **Stock Signal AI** | 반도체 7종목 LSTM 매매신호 예측 + 백테스트·리스크관리 (학습용) | PyTorch, LSTM, FastAPI, Streamlit |
| 06 | **JobMate AI** | 채용공고 URL → AI 파싱 → Google Sheets 저장 → 마감 Slack 알림 | Python, Streamlit, Playwright, Gemini API, Sheets API, Slack, cron |

## Bootcamp Projects

| # | 프로젝트 | 설명 | 기술 |
|---|---------|------|------|
| B01 | **보험 데이터 분석** | 의료 보험 데이터 기반 보험료 모델링 및 마케팅 전략 | SQL, 데이터분석 |
| B02 | **배너 광고 성과 분석** | 내부/외부 배너 비교 → 혼합 운영 전략으로 수익 7% 향상 | Python, RFM |
| B03 | **고객 이탈 예측** | ML 기반 은행 고객 이탈 예측 (Recall 80.3%) + 군집화 전략 | LightGBM, K-means |
| B04 | **K-선케어 일본 진출 전략** | 한·일 뷰티 플랫폼 크롤링 + Tableau 대시보드 → STP 전략 | 크롤링, Tableau, Pandas |

## Stack

- **Frontend**: Vanilla HTML/CSS/JS (SPA, hash-based routing, 무빌드·외부 의존성 없음)
- **Files**: `index.html` + `styles.css` + `app.js` (head 1줄 인라인 스크립트만 유지)
- **Hosting**: GitHub Pages
- **Font**: Pretendard Variable + JetBrains Mono
- **Contact**: Google Sheets + Apps Script (문의 저장 + 서버측 웹훅 Slack 알림)

## Structure

```
web/
├── index.html          # 메인 SPA (랜딩 + About + Work/프로젝트 상세)
├── styles.css          # 전체 스타일
├── app.js              # 라우팅·인터랙션 (타이핑·양방향 스크롤 등장·카운트업·스킬바·캐러셀·진행바)
├── og-image.png        # OG 이미지
└── screenshots/        # 스크린샷 (800x560 통일)
```

## Contact

- Email: ldsjoy@naver.com
- GitHub: [rena-data](https://github.com/rena-data)
