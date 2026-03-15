# Toolverse 초기 설정 가이드

## 1단계: 도메인 구매 (5분)

### 추천 도메인 등록업체
- **Porkbun** (https://porkbun.com) — 가장 저렴, .io 약 $30/년
- **Namecheap** (https://namecheap.com) — .io 약 $33/년
- **Cloudflare Registrar** (https://dash.cloudflare.com) — 원가에 판매

### 할 일
1. `toolverse.io` 검색 후 구매 (또는 대안: toolverse.dev, toolverse.com)
2. 구매 후 네임서버(NS)를 Cloudflare로 변경

---

## 2단계: Cloudflare 설정 (15분)

### 2-1. 계정 생성
1. https://dash.cloudflare.com 가입 (무료)
2. "Add a site" 클릭 → `toolverse.io` 입력
3. Free 플랜 선택

### 2-2. DNS 설정
Cloudflare DNS에서 다음 레코드 추가:

| Type  | Name | Content           | Proxy |
|-------|------|-------------------|-------|
| CNAME | @    | toolverse.pages.dev | ON  |
| CNAME | *    | toolverse.pages.dev | ON  |

> `*` 레코드가 와일드카드 — 모든 서브도메인(json.toolverse.io 등)을 자동 처리

### 2-3. Cloudflare Pages 프로젝트 생성
1. Cloudflare 대시보드 → Pages → "Create a project"
2. "Connect to Git" → GitHub 저장소 연결
3. 프로젝트 이름: `toolverse`
4. Build settings:
   - Build command: (비워두기 — 빌드 불필요, 정적 파일)
   - Build output directory: `.` (루트)
5. Deploy!

### 2-4. 커스텀 도메인 연결
1. Pages 프로젝트 → Custom domains → Add domain
2. `toolverse.io` 추가
3. `*.toolverse.io` 추가 (와일드카드)
4. DNS가 자동 확인됨 → SSL 인증서 자동 발급

---

## 3단계: GitHub 설정 (10분)

### 3-1. 저장소 생성 & 푸시
```bash
cd C:\Users\love2\TEAM
git remote add origin https://github.com/YOUR_USERNAME/toolverse.git
git push -u origin main
```

### 3-2. GitHub Secrets 추가 (자동 배포용)
GitHub → Settings → Secrets and variables → Actions:

| Secret Name             | 값                                    |
|------------------------|---------------------------------------|
| CLOUDFLARE_API_TOKEN   | Cloudflare API Token (Pages 권한)     |
| CLOUDFLARE_ACCOUNT_ID  | Cloudflare 대시보드 URL에 있는 Account ID |

### Cloudflare API Token 만들기
1. https://dash.cloudflare.com/profile/api-tokens
2. "Create Token" → "Edit Cloudflare Pages" 템플릿 사용
3. 생성된 토큰 복사 → GitHub Secret에 저장

---

## 4단계: 서브도메인 라우팅 (Cloudflare Pages)

각 도구는 서브도메인으로 접근합니다:
- `json.toolverse.io` → `sites/json-formatter.html`
- `mortgage.toolverse.io` → `sites/mortgage-calculator.html`

### _redirects 파일 (Cloudflare Pages 라우팅)
프로젝트 루트에 `_redirects` 파일로 서브도메인 → 파일 매핑.
또는 `_worker.js`로 동적 라우팅 (더 유연함).

---

## 5단계: 확인 체크리스트

- [ ] 도메인 구매 완료
- [ ] Cloudflare에 도메인 추가, NS 변경
- [ ] Cloudflare Pages 프로젝트 생성
- [ ] 와일드카드 DNS 레코드 (*.toolverse.io)
- [ ] GitHub 저장소 생성 & 코드 푸시
- [ ] GitHub Secrets 설정
- [ ] `toolverse.io` 접속 확인 → 랜딩 페이지 표시
- [ ] `json.toolverse.io` 접속 확인 (첫 도구 배포 후)

---

## 예상 비용 요약

| 항목 | 비용 | 빈도 |
|------|------|------|
| 도메인 (.io) | $30-33 | 연간 |
| Cloudflare Pages | $0 | 무료 |
| GitHub | $0 | 무료 |
| Claude Code Max | 이미 구독 중 | 월간 |
| **총 추가 비용** | **$30-33 (1회)** | |
