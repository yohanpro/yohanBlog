export const profile = {
  name: "김요한",
  nameEn: "Yohan Kim",
  title: "Frontend Engineer",
  experience: "8년차",
  email: "yohankim.pro@gmail.com",
  phone: "010-7920-4030",
  github: "https://github.com/yohanpro",
  linkedin: "",
  tagline: "스타트업부터 대기업까지, 사용자 경험을 설계하는 엔지니어",
  summary: `월간 250만+ 사용자 서비스에서 대규모 트래픽을 고려한 UI/UX 설계 및 성능 최적화를 수행했습니다.
Vue 2 → Vue 3 → React 18까지 점진적 마이그레이션을 설계하고 실행한 경험이 있으며,
모노레포 기반 아키텍처 설계로 팀의 개발 생산성을 향상시켰습니다.`,
};

export interface Project {
  id: string;
  title: string;
  titleEn: string;
  company: string;
  period: string;
  description: string;
  challenge: string;
  solution: string;
  impact: string[];
  techStack: string[];
  links?: { label: string; url: string }[];
  featured: boolean;
}

export const projects: Project[] = [
  {
    id: "lotte-travel-msa",
    title: "롯데ON 여행 MSA 신규 런칭",
    titleEn: "Lotte ON Travel MSA Launch",
    company: "롯데이커머스",
    period: "2025.05 - 2025.07",
    description:
      "롯데ON 신규 여행 서비스의 상품상세 페이지 프론트엔드 아키텍처를 설계하고 리드했습니다.",
    challenge:
      "기존 모놀리식 구조에서 첫 콘텐츠 표시까지 27.3초가 소요되는 심각한 성능 문제가 있었습니다. 또한 향후 항공권, 해외숙박 등 신규 도메인 확장을 고려한 유연한 구조가 필요했습니다.",
    solution:
      "FSD(Feature Sliced Design) 패턴을 적용한 모듈화된 아키텍처를 설계했습니다. HTTP 인프라 계층화, 도메인별 라우팅 분리로 독립 배포 가능한 구조를 구축했습니다.",
    impact: [
      "FCP 27.3초 → 4.7초 (83% 개선)",
      "LCP 58% 개선",
      "빌드 시간 23분 → 2분 30초 (87% 단축)",
      "향후 도메인 확장 시 재사용 가능한 구조 확보",
    ],
    techStack: ["Vue 2.7", "Composition API", "Vite", "FSD Pattern"],
    featured: true,
  },
  {
    id: "e2e-automation",
    title: "E2E 테스트 자동화 시스템",
    titleEn: "E2E Test Automation System",
    company: "롯데이커머스",
    period: "2024.02 - 2024.06",
    description:
      "롯데ON 주요 페이지의 E2E 테스트 스케줄러를 구축하여 장애를 사전에 감지하는 시스템을 개발했습니다.",
    challenge:
      "수동 QA에 의존하여 크리티컬한 장애(장바구니 담기 실패, 이미지 누락 등)가 프로덕션에서 발견되는 경우가 있었습니다.",
    solution:
      "Playwright 기반 E2E 테스트 러너와 CronJob 스케줄러를 구축하고, WebSocket으로 실시간 상태를 동기화했습니다. Slack API를 연동하여 자동 알림 시스템을 구현했습니다.",
    impact: [
      "4건의 크리티컬 장애 사전 감지",
      "롯데온 대표이사에게 우수사례로 채택",
      "QA 시간 50% 이상 절감",
    ],
    techStack: [
      "Next.js",
      "Express.js",
      "Playwright",
      "WebSocket",
      "Slack API",
      "CronJob",
    ],
    featured: true,
  },
  {
    id: "ts-pinch-zoom",
    title: "ts-pinch-zoom 라이브러리",
    titleEn: "ts-pinch-zoom Library",
    company: "롯데이커머스",
    period: "2024.12 - 2025.01",
    description:
      "모바일 상품 상세 이미지의 핀치 줌 기능을 위한 TypeScript 라이브러리를 개발하고 NPM에 배포했습니다.",
    challenge:
      "기존 솔루션사 의존으로 커스터마이징이 어렵고 라이선스 비용이 발생했습니다. 또한 모바일 브라우저의 기본 제스처와 충돌 문제가 있었습니다.",
    solution:
      "터치 이벤트를 직접 핸들링하여 줌 중심점 계산, 방향 잠금 등의 로직을 구현했습니다. 팩토리 패턴으로 환경별 로직을 추상화했습니다.",
    impact: [
      "솔루션사 의존도 완전 제거",
      "NPM 배포로 재사용성 확보",
      "기술 내재화 목표 달성",
    ],
    techStack: ["TypeScript", "Vite", "NPM"],
    links: [
      { label: "NPM", url: "https://www.npmjs.com/package/ts-pinch-zoom" },
      { label: "GitHub", url: "https://github.com/yohanpro/ts-pinchzoom" },
    ],
    featured: true,
  },
  {
    id: "klone-studio",
    title: "클론 스튜디오 React 마이그레이션",
    titleEn: "Klone Studio React Migration",
    company: "클레온",
    period: "2022.09 - 2023.06",
    description:
      "AI 휴먼 생성 플랫폼의 에디터를 Vue 3에서 React 18로 마이그레이션하고 Canvas 기능을 고도화했습니다.",
    challenge:
      "Vue 3 기반 스파게티 코드로 신규 기능 추가 시 기존 코드와 충돌이 빈번했고, 팀 내 React 통합 전략이 결정되어 마이그레이션이 필요했습니다.",
    solution:
      "Amplify 서브디렉토리 기능으로 Vue/React 라우팅을 분리하여 점진적 마이그레이션을 진행했습니다. Konva 기반 Canvas에 팩토리/컴포지트 패턴을 적용하여 객체별 동작 규칙을 유연하게 관리했습니다.",
    impact: [
      "Vue → React 마이그레이션 성공적 완료",
      "객체 다중 선택/삭제, 단축키 기능 추가",
      "유지보수성 및 확장성 대폭 개선",
    ],
    techStack: [
      "React 18",
      "TypeScript",
      "Konva",
      "Redux Toolkit",
      "React Query",
    ],
    links: [{ label: "Service", url: "https://klone.chat" }],
    featured: true,
  },
];

export const techStacks = {
  frontend: [
    { name: "React", level: "expert" },
    { name: "Vue.js", level: "expert" },
    { name: "Next.js", level: "advanced" },
    { name: "TypeScript", level: "expert" },
  ],
  tools: [
    { name: "Vite", level: "advanced" },
    { name: "Webpack", level: "advanced" },
    { name: "Turborepo", level: "intermediate" },
    { name: "Docker", level: "intermediate" },
  ],
  testing: [
    { name: "Playwright", level: "advanced" },
    { name: "Jest", level: "intermediate" },
  ],
  etc: [
    { name: "Git", level: "expert" },
    { name: "CI/CD", level: "advanced" },
    { name: "AWS", level: "intermediate" },
  ],
};

export const experiences = [
  {
    company: "롯데이커머스",
    role: "Product 개발팀",
    period: "2023 - 현재",
    description: "롯데ON 상품상세 프론트엔드 개발",
  },
  {
    company: "클레온",
    role: "웹팀",
    period: "2022 - 2023",
    description: "AI 휴먼 생성 플랫폼 개발",
  },
  {
    company: "프리티소프트",
    role: "IT팀 (프론트엔드)",
    period: "2021 - 2022",
    description: "카타르 월드컵 공식 홈페이지 제작",
  },
  {
    company: "이노부스트",
    role: "IT팀",
    period: "2018 - 2020",
    description: "웹 서비스 개발",
  },
];
