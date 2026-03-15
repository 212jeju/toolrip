# Toolverse — 글로벌 유틸리티 플랫폼

## 프로젝트 개요
- 100개 단일 파일 HTML 유틸리티 도구를 서브도메인으로 배포
- 수익 모델: Google AdSense 디스플레이 광고
- 타깃: 글로벌 영어권 자연 검색(SEO) 트래픽
- 도메인: toolverse.io (서브도메인: json.toolverse.io, bmi.toolverse.io 등)

## Tech Stack
- 아키텍처: 단일 파일 HTML (각 도구 = 1개 HTML 파일)
- 스타일: shared/style.css (다크모드 테마, 카테고리별 accent color)
- 스크립트: shared/common.js (공용 기능: 클립보드, 광고, 분석)
- 호스팅: Cloudflare Pages (정적 사이트, 무료)
- DNS: Cloudflare DNS (와일드카드 *.toolverse.io)
- CI/CD: GitHub Actions → Cloudflare Pages 자동 배포
- 분석: Cloudflare Web Analytics + GA4
- 광고: Google AdSense

## Directory Structure
```
TEAM/
├── sites/               ← 도구 HTML 파일 (json-formatter.html 등)
├── shared/              ← 공유 CSS, JS
│   ├── style.css        ← 다크모드 테마 + 컴포넌트 스타일
│   └── common.js        ← 공용 함수 (클립보드, 광고 로드, 분석)
├── legal/               ← 법적 페이지 (privacy.html, terms.html 등)
├── index.html           ← 메인 랜딩 페이지 (도구 카탈로그)
├── services.json        ← 100개 서비스 마스터 리스트
├── sitemap.xml          ← 전체 사이트맵 (자동 생성)
├── robots.txt           ← 크롤러 설정
└── .github/workflows/   ← 배포 자동화
```

## HTML 도구 작성 규칙

### 필수 구조
- 모든 도구는 `sites/` 폴더에 단일 HTML 파일로 저장
- 파일명: kebab-case (예: json-formatter.html, bmi-calculator.html)
- 외부 의존성 금지 (CDN 포함). 모든 CSS/JS는 인라인 또는 shared/ 참조
- shared/style.css는 `<link>` 태그로 참조
- shared/common.js는 `<script>` 태그로 참조

### SEO 필수 요소 (모든 페이지)
- `<title>`: 주요 키워드 + "Online — Free, Fast, No Signup" (60자 미만)
- `<meta name="description">`: 키워드 + 가치 제안 (160자 미만)
- 단일 `<h1>` 태그에 주요 키워드
- Schema.org WebApplication JSON-LD 구조화 데이터
- Open Graph + Twitter Card 메타 태그
- 내부 링크 5개 이상 (헤더 + 푸터)
- Canonical URL

### 콘텐츠 필수 요소 (AdSense 승인)
- 각 페이지 최소 500단어 오리지널 텍스트
- FAQ 섹션 (5-8개 질문, `<details>` 태그)
- Feature Cards (3-6개 기능 설명)
- How-to 또는 가이드 섹션
- 플레이스홀더, 로렘 입숨 금지

### 광고 슬롯 배치
- `.ad-top`: 도구 상단 (728x90 반응형)
- `.ad-in-content`: 도구와 FAQ 사이
- `.ad-sidebar`: 데스크톱 사이드바 (300x250)
- `.ad-bottom`: 페이지 하단 (336x280)

### 성능 기준
- LCP < 2초 (Core Web Vitals)
- 외부 폰트 금지 (system-ui 스택 사용)
- 이미지 최소화, SVG 인라인 선호
- CSS/JS는 최소화(minify) 상태로 배포

### 카테고리별 Accent Color
도구의 카테고리에 따라 CSS 변수를 오버라이드:
```html
<style>:root{--accent:var(--finance)}</style>
```
- Finance: --finance (#10b981)
- Health: --health (#f59e0b)
- Developer: --developer (#3b82f6)
- Text: --text-cat (#8b5cf6)
- Conversion: --conversion (#06b6d4)
- Math: --math (#ec4899)
- DateTime: --datetime (#f97316)
- Security: --security (#ef4444)
- Design: --design (#a855f7)
- SEO: --seo (#14b8a6)

## Naming Conventions
- 도구 파일: kebab-case (json-formatter.html)
- 서브도메인: 도구명 약어 (json.toolverse.io)
- CSS 클래스: shared/style.css에 정의된 것 사용
- JS 함수: camelCase

## 법적 페이지 (AdSense 승인 필수)
- `legal/privacy.html` — 개인정보처리방침 (GDPR 준수)
- `legal/terms.html` — 이용약관
- `legal/about.html` — 소개 페이지
- `legal/contact.html` — 연락처 페이지
