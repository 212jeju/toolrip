---
name: toolrip SEO 색인·트래픽 액션 플랜 (2026-06-09 시작)
description: AdSense 2차 거절(low value) 후 진짜 병목(색인 32/142 + 트래픽 0) 공략 플랜 — 미색인 목록, 색인요청 케이던스, 디렉토리 등재 패키지
type: project
---

# toolrip 승인 공략 — 색인·트래픽 액션 플랜

## ⭐ 2026-06-10 전략 피벗: 파이낸스 전문점화 (사용자 결정)
"low value" 근본 원인 = commodity·무포커스·무트래픽. 증상(sitemap/색인) 말고 뿌리를 치기로 → **잡화점(100 도구)에서 파이낸스 전문점으로 topical authority 구축.**

**Phase 1 완료 (라이브, 커밋 1d52dfe):**
- `/finance` 허브 페이지 신규 — 15개 파이낸스 계산기를 4그룹(대출·투자·비즈니스·일상)으로 묶고, ~900단어 오리지널 전문 콘텐츠(APR vs 이자율, 복리 빈도, 명목 vs 실질수익률, 총이자 vs 월납입), FAQ, CollectionPage+ItemList+FAQ+Breadcrumb 스키마
- `_worker.js`에 `/finance` 라우트, sitemap 등록(priority 0.9), 홈 네비에 Finance, **15개 파이낸스 도구 breadcrumb를 허브로 상향링크**(/#finance→/finance) = 클러스터 형성
- 라이브 200 확인, 회귀 없음. sitemap 재제출(발견 143), /finance 색인요청 완료

**Phase 2 완료 (2026-06-10, 라이브):**
- ✅ 가짜 4인 저자 페르소나 전면 폐기 → 정직한 단일 "Toolrip Editorial Team"/1인 메이커 about (커밋 96b7ded, f53fdd7). /authors/* 301→/about
- ✅ 홈페이지 finance-first 재포지셔닝: hero·title·meta가 파이낸스 계산기 전면, /finance CTA, 100도구 카탈로그는 아래 보존 (커밋 fc69acb)
- ✅ 파이낸스 허브 고유 콘텐츠 심화: "계산기 선택 가이드" + 공식검증 worked examples 3개(모기지/복리/APR vs APY) + 용어집 (~500단어, 커밋 fc69acb)
- ✅ sitemap 재제출(143)·홈 색인요청 완료

**Phase 2 잔여 (선택/사용자 필요):**
- **실명 운영자 정체성** — 최대 E-E-A-T엔 사용자 실명/약력 필요(PII라 사용자 승인 필수). 지금은 정직한 익명 1인 메이커까지 완료.
- 플래그십 파이낸스 도구 개별 페이지 템플릿 FAQ 심화 (복잡 JS라 신중히, 선택)

**Phase 3 (트래픽 붙은 뒤):**
- 비파이낸스 도구 정리/후순위화 또는 2차 클러스터(개발 도구 20개) 구축 판단
- 디렉토리 등재(아래) + Show HN/Reddit로 파이낸스 도구 1개 유통

---

## 2026-06-15 점검 결과 (GSC 직접 확인)
**GSC 접근법 (중요, 다음 세션용):** 212jeju 계정, 속성은 **URL-프리픽스 `https://toolrip.com/`** (sc-domain 도메인속성 아님 — sc-domain은 접근 불가). 브라우저(212jeju 로그인)로 Claude 대행 가능.

**실측 데이터:**
- 색인 **43개** (6/9 32개 → 43개 ↑), 총 클릭 **2회** (1→2), 코어웹바이탈 데이터없음
- 사이트맵 정상: /sitemap.xml, 6/10 읽음, 성공, 발견 143. URL 형식 정확(단축 URL), **결함 아님**
- 근본 병목 = **크롤 예산/처리 속도** (Google이 143 중 46만 처리, 나머지 ~97 미발견). URL형식·사이트맵 문제 아님 확정
- 미색인 사유: 404 1개 + "크롤됨-미색인" 2개 + (발견-미색인 0)
- **재신청 기준 대비: 클릭>0 충족(2), 색인 43/60 (72%)**

**404 정체:** `/errorCorrectionLevel` = QR 라이브러리 JS 식별자가 만든 **유령 URL** (실제 `<a href>` 없음, grep 확인). 404 핸들러 정상 동작 → 재크롤 시 자동 소멸, 코드 수정 불필요.

**오늘 수정 (커밋 dfecc43):** 깨진 내부 링크 15개 일괄 수정 — 도구 슬러그오타 6 + blog 슬러그오타 5 + 없는도구 홍보 CTA 3개 재작성(Encryption/Find&Replace→실제도구) + /authors/about→/about. **아직 push 안 함(사용자 승인 대기)** — push 시 Cloudflare 자동배포.

**색인 생성 요청 제출(파이낸스 클러스터, 우선크롤큐):** /apr /debt-payoff /loan-compare /profit-margin (4개). 나머지 파이낸스(finance,mortgage,roi,break-even,inflation,emi,compound-interest,sales-tax,retirement,bmi,percentage 등)는 **이미 색인됨**. → 플래그십은 다 들어가 있고, 미색인은 롱테일. 일 할당량 ~10이라 다음 배치는 비파이낸스 고검색 롱테일로.

# toolrip 승인 공략 — 색인·트래픽 액션 플랜 (원본)

목표: **AdSense 승인** (수익 무관, 사용자 명시). 병목은 콘텐츠가 아니라 **색인 페이지 수(32/142) + 검색 트래픽(클릭 1회)**. 관련: [[project_toolrip_adsense_timeline]], [[project_toolrip_accounts]].

## 2026-06-09 완료한 것
- sitemap lastmod 109개 stale(3/19)→6/9 교정, push+배포 (커밋 41697f7)
- GSC sitemap 재제출 (발견 142)
- title 5개 60자 초과 → front-load 수정 (커밋 46e655a)
- **GSC 색인 요청 10개 제출** (우선순위 크롤 큐 등록 확인): `/age /regex /case /jwt /md5 /sha256 /markdown /sql /timezone /bmr`

## 색인 요청 케이던스 (하루 ~10개 한도)
GSC → URL 검사창에 URL 입력 → "색인 생성 요청" 클릭. 매일 아래 배치 순서로 10개씩.
브라우저(212jeju 로그인)로 Claude가 대행 가능 — "오늘 색인요청 배치 돌려줘" 하면 됨.

### 남은 미색인 64개 (검색가치 높은 순, 배치별 10개)
**배치 1 (변환·인코딩 — 검색량 높음):** /temperature /url-encode /yaml /cron /diff /epoch /roman /prime /csv-json /json-csv
**배치 2 (디자인·텍스트):** /color-palette /gradient /box-shadow /color-blind /aspect-ratio /lorem /slug /dedupe /whitespace /binary
**배치 3 (헬스·파이낸스):** /body-fat /macro /ideal-weight /water-intake /heart-rate /due-date /apr /roi /profit-margin /debt-payoff
**배치 4 (수학·날짜):** /statistics /quadratic /pythagorean /area-volume /scientific /matrix /gcf-lcm /date-diff /countdown /week-number
**배치 5 (개발·기타):** /css-minify /js-minify /html-entity /escape /ascii-hex /img-base64 /ip /rot13 /password-strength /number-base
**배치 6 (나머지):** /lines /random-string /hex-rgb /length /weight /speed /data-storage /angle /timestamp /business-days /loan-compare /svg-png /meta-tag /og-preview

## 디렉토리 등재 패키지 (백링크·크롤예산↑ — 사용자가 직접 제출)
신생 도메인 크롤예산을 늘리고 권위 신호를 주는 가장 빠른 합법 수단. 무료 등재처:
- **AlternativeTo** (alternativeto.net) — 도구별 등재
- **Product Hunt** (producthunt.com) — "Toolrip - 100 free online tools" 런칭
- **SaaSHub / Slant / G2** — 카테고리 등재
- **Awesome lists (GitHub)** — awesome-web-tools, free-for-dev 등에 PR
- **Reddit** r/InternetIsBeautiful, r/webdev (자기홍보 규칙 준수)
- **Hacker News** Show HN
- **무료 도구 디렉토리:** toolsfor.dev, freetools.directory, saasworthy 등

### 등재용 한 줄 설명 (복붙)
> Toolrip — 100 free, fast, privacy-first online tools: calculators (mortgage, BMI, compound interest), developer utilities (JSON, regex, JWT, hash), converters, and more. No signup, 100% client-side.

## 트래픽 레버 (시간 필요, 코드로 못 당김)
- 위 디렉토리 백링크 → 크롤예산·권위↑
- 저경쟁 롱테일 순위 누적 (이미 색인된 상위 페이지가 클릭 받기 시작하면 신호↑)
- 도메인 나이

## 재신청 기준
색인 60+ 도달 AND 주간 클릭 > 0 (실수요 입증) → AdSense 재신청. 그 전엔 또 low value 가능성 높음.
