---
name: 일정 질문 시 스케줄된 태스크부터 확인
description: 사용자가 "다음 작업일" "언제 할까" "일정" 등을 물으면 추측하지 말고 mcp__scheduled-tasks__list_scheduled_tasks를 먼저 호출
type: feedback
---
사용자가 일정·다음 작업일·예정된 작업을 물어볼 때는, 메모리나 git 커밋 패턴으로 추측하기 전에 반드시 `mcp__scheduled-tasks__list_scheduled_tasks` (그리고 필요시 `CronList`)를 먼저 호출해서 스케줄된 태스크가 있는지 확인할 것.

**Why:** toolrip 프로젝트에서 4주 콘텐츠 업데이트 일정(toolrip-week1~week4-content)을 미리 짜둔 적이 있는데, "다음 작업일은 언제야?" 물었을 때 스케줄을 조회하지 않고 git 커밋 요일 패턴으로 "오늘이 다음 작업일일 가능성이 높습니다"라고 추측 답변함. 사용자가 "너랑 업데이트 일정 짰잖아"라고 다시 묻고 나서야 확인했음. 신뢰가 깨지는 패턴.

**How to apply:**
- "언제", "일정", "다음", "스케줄", "예정", "할 일" 같은 시간/계획 관련 키워드가 나오면 트리거
- list_scheduled_tasks 결과가 비어있을 때만 다른 단서(메모리, git log)로 추측
- 추측할 때도 "스케줄된 태스크는 없습니다"라고 명시한 뒤 추측이라고 표시
