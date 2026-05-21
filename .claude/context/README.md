# Claude Code Project Context

이 디렉토리는 **새 컴퓨터에서 같은 프로젝트를 열었을 때 Claude가 즉시 컨텍스트를 회복할 수 있도록** 영구 메모리를 git으로 동기화하는 공간입니다.

## 파일 구조

- `MEMORY.md` — 인덱스 (다른 파일들의 한 줄 요약)
- `project_*.md` — 프로젝트 상태/계획 (AdSense 일정, 결정 사항 등)
- `feedback_*.md` — Claude 행동 교정 규칙 (사용자 피드백 기반)

## 새 컴퓨터에서 컨텍스트 복원하기

1. 이 리포지토리를 clone
2. `.claude/context/` 의 파일들을 다음 위치로 복사:

   - Windows: `C:\Users\<유저명>\.claude\projects\<인코딩된-프로젝트경로>\memory\`
   - macOS/Linux: `~/.claude/projects/<인코딩된-프로젝트경로>/memory/`

   "인코딩된 프로젝트 경로"는 프로젝트 절대경로의 `/`, `\`, `:` 를 `-` 로 바꾼 것.
   (예: `C:\Users\212\Desktop\claude project` → `C--Users-212-Desktop-claude-project`)

3. Claude Code를 그 프로젝트 디렉토리에서 시작하면 메모리가 자동 로드됨

## 자동 동기화 흐름

- 새 메모리/규칙이 생기면 사용자가 commit 요청
- Claude는 두 위치 모두 동시 업데이트 (실제 메모리 디렉토리 + 이 디렉토리)
- git push로 다른 컴퓨터에서도 사용 가능

## 주의

- 비밀 정보(토큰, API 키, 개인정보 등) 절대 포함하지 말 것 — 이 디렉토리는 git에 올라감
- 메모리 = 영구적 컨텍스트. 한 번 쓴 일회성 작업 메모는 여기에 넣지 말 것
