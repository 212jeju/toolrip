---
name: toolrip SEO 색인·트래픽 액션 플랜 (2026-06-09 시작)
description: AdSense 2차 거절(low value) 후 진짜 병목(색인 32/142 + 트래픽 0) 공략 플랜 — 미색인 목록, 색인요청 케이던스, 디렉토리 등재 패키지
type: project
---

# toolrip 승인 공략 — 색인·트래픽 액션 플랜

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
