export const profile = {
  name: "김요한",
  nameEn: "Yohan Kim",
  title: "Frontend Engineer",
  experience: "8년차",
  email: "yohankim.pro@gmail.com",
  github: "https://github.com/yohanpro",
  linkedin: "",
  tagline: "스타트업부터 대기업까지, 사용자 경험을 설계하는 엔지니어",
  summary: `월간 250만+ 사용자 서비스에서 대규모 트래픽을 고려한 UI/UX 설계 및 성능 최적화를 수행했습니다.
Vue 2 → Vue 3 → React 18까지 점진적 마이그레이션을 설계하고 실행한 경험이 있으며,
모노레포 기반 아키텍처 설계로 팀의 개발 생산성을 향상시켰습니다.`,
};

export const achievements = [
  { value: 8, suffix: "년차", label: "프론트엔드 경력" },
  { value: 83, suffix: "%", label: "성능 개선" },
  { value: 4.9, suffix: "/5.0", label: "멘토 평가" },
  { value: 250, suffix: "만+", label: "월간 사용자" },
];

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
  {
    id: "docker-dev-env",
    title: "프론트엔드 개발환경 Docker 통합",
    titleEn: "Frontend Development Environment Docker Integration",
    company: "롯데이커머스",
    period: "2024.08 - 2024.10",
    description:
      "팀 전체의 개발환경을 Docker로 통합하여 환경 설정 시간을 획기적으로 단축하고 개발 생산성을 향상시켰습니다.",
    challenge:
      "신입 개발자 온보딩 시 개발 환경 구축에 평균 3일이 소요되었고, 로컬 환경 차이로 인한 버그 재현이 어려웠습니다.",
    solution:
      "Docker Compose로 프론트엔드 개발 서버, API Mock 서버, Redis를 통합했습니다. Makefile로 주요 명령어를 추상화하여 팀원들이 쉽게 사용할 수 있도록 했습니다.",
    impact: [
      "환경 설정 시간 3일 → 15분 (92% 단축)",
      "로컬 환경 이슈 90% 이상 감소",
      "팀 전체 생산성 향상",
    ],
    techStack: ["Docker", "Docker Compose", "Makefile", "Node.js"],
    featured: true,
  },
  {
    id: "editor-canvas",
    title: "Editor Canvas 고도화 (Konva)",
    titleEn: "Editor Canvas Enhancement with Konva",
    company: "클레온",
    period: "2023.01 - 2023.06",
    description:
      "AI 휴먼 에디터의 Canvas 기능을 고도화하여 객체 다중 선택, 정렬, 단축키 등 고급 기능을 구현했습니다.",
    challenge:
      "Canvas에서 다양한 객체 타입(텍스트, 이미지, 배경)마다 다른 동작 규칙을 효율적으로 관리해야 했습니다.",
    solution:
      "팩토리 패턴으로 객체 생성 로직을 통합하고, 컴포지트 패턴으로 다중 선택 시 그룹 동작을 구현했습니다. Konva의 Transformer API를 활용하여 회전, 크기 조절을 자연스럽게 처리했습니다.",
    impact: [
      "객체 다중 선택/삭제 기능 구현",
      "단축키(Ctrl+Z, Delete 등) 추가",
      "사용자 편의성 대폭 향상",
    ],
    techStack: [
      "Konva",
      "TypeScript",
      "React 18",
      "Factory Pattern",
      "Composite Pattern",
    ],
    featured: true,
  },
  {
    id: "admin-monorepo",
    title: "상품상세 Admin 모노레포 구축",
    titleEn: "Product Detail Admin Monorepo",
    company: "롯데이커머스",
    period: "2024.11 - 2025.01",
    description:
      "상품상세 어드민 시스템을 Turborepo 기반 모노레포로 전환하여 코드 재사용성과 개발 효율성을 높였습니다.",
    challenge:
      "6개의 독립 프로젝트가 공통 UI 컴포넌트를 중복으로 개발하며 유지보수가 어려웠습니다.",
    solution:
      "Turborepo로 모노레포를 구축하고, 공통 UI를 @lotte/ui 패키지로 분리했습니다. 빌드 파이프라인을 최적화하여 변경된 패키지만 빌드하도록 했습니다.",
    impact: [
      "중복 코드 60% 이상 제거",
      "공통 컴포넌트 재사용으로 개발 시간 단축",
      "일관된 UI/UX 유지",
    ],
    techStack: ["Turborepo", "React 18", "TypeScript", "Vite"],
    featured: false,
  },
  {
    id: "product-detail-v3",
    title: "상품상세 페이지 V3 개발",
    titleEn: "Product Detail Page V3",
    company: "롯데이커머스",
    period: "2023.08 - 2024.01",
    description:
      "롯데ON 상품상세 페이지의 3세대 버전을 개발하여 사용자 경험과 성능을 개선했습니다.",
    challenge:
      "레거시 코드가 누적되어 신규 기능 추가가 어려웠고, 모바일 성능 개선이 필요했습니다.",
    solution:
      "Vue 2.7 Composition API로 컴포넌트를 재설계하고, 이미지 레이지 로딩과 가상 스크롤을 적용했습니다. API 호출을 최적화하여 불필요한 요청을 제거했습니다.",
    impact: [
      "페이지 로딩 속도 30% 개선",
      "코드 가독성 및 유지보수성 향상",
      "월간 250만+ 사용자에게 서비스",
    ],
    techStack: ["Vue 2.7", "Composition API", "Intersection Observer", "Vite"],
    featured: false,
  },
  {
    id: "gyeonggi-travel",
    title: "경기여행 플랫폼",
    titleEn: "Gyeonggi Travel Platform",
    company: "프리티소프트",
    period: "2021.04 - 2021.08",
    description:
      "경기관광공사의 여행 정보 플랫폼 프론트엔드를 개발하고 관리자 페이지를 구축했습니다.",
    challenge:
      "다양한 관광 정보를 직관적으로 표시하고, 관리자가 쉽게 콘텐츠를 관리할 수 있어야 했습니다.",
    solution:
      "Vue.js로 사용자 페이지를 개발하고, Quasar Framework로 관리자 대시보드를 구축했습니다. 지도 API를 연동하여 관광지 위치 정보를 제공했습니다.",
    impact: [
      "경기관광공사 공식 플랫폼 런칭",
      "관리자 페이지로 콘텐츠 관리 효율화",
      "관광 정보 접근성 향상",
    ],
    techStack: ["Vue.js", "Quasar", "Kakao Map API", "Vuex"],
    featured: false,
  },
  {
    id: "qatar-worldcup",
    title: "2022 카타르 월드컵 공식 홈페이지",
    titleEn: "2022 Qatar World Cup Official Website",
    company: "프리티소프트",
    period: "2021.09 - 2022.02",
    description:
      "2022 카타르 월드컵 공식 홈페이지 프론트엔드를 개발하고 다국어 지원을 구현했습니다.",
    challenge:
      "월드컵 기간 동안 대규모 트래픽을 처리하고, 아랍어 RTL 레이아웃을 지원해야 했습니다.",
    solution:
      "Next.js와 i18n을 사용하여 다국어 지원을 구현하고, RTL 레이아웃을 CSS로 처리했습니다. 이미지 최적화와 CDN 캐싱으로 성능을 개선했습니다.",
    impact: [
      "월드컵 공식 홈페이지 성공적 런칭",
      "10개 언어 지원 (아랍어 RTL 포함)",
      "대규모 트래픽 안정적 처리",
    ],
    techStack: ["Next.js", "React", "i18n", "Styled Components"],
    links: [
      {
        label: "Article",
        url: "https://www.yna.co.kr/view/AKR20211117087900371",
      },
    ],
    featured: false,
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
    achievements: [
      "FCP 83% 개선 (27.3초 → 4.7초)",
      "E2E 테스트 자동화 시스템 구축 (대표이사 우수사례)",
      "NPM 라이브러리 개발 및 배포 (ts-pinch-zoom)",
      "모노레포 기반 아키텍처 설계",
      "Docker 기반 개발환경 통합 (환경 설정 시간 92% 단축)",
    ],
  },
  {
    company: "클레온",
    role: "웹팀",
    period: "2022 - 2023",
    description: "AI 휴먼 생성 플랫폼 개발",
    achievements: [
      "Vue 3 → React 18 대규모 마이그레이션 리드",
      "Konva 기반 Canvas 에디터 고도화",
      "팩토리/컴포지트 패턴 적용으로 유지보수성 개선",
      "레이어드 아키텍처 설계",
    ],
  },
  {
    company: "프리티소프트",
    role: "IT팀 (프론트엔드)",
    period: "2021 - 2022",
    description: "카타르 월드컵 공식 홈페이지 제작",
    achievements: [
      "2022 카타르 월드컵 공식 홈페이지 개발",
      "10개 언어 다국어 지원 (아랍어 RTL 포함)",
      "경기관광공사 여행 플랫폼 개발",
      "대규모 트래픽 안정적 처리",
    ],
  },
  {
    company: "이노부스트",
    role: "IT팀",
    period: "2018 - 2020",
    description: "웹 서비스 개발",
    achievements: [
      "Vue.js 기반 웹 서비스 개발",
      "프론트엔드 기술 스택 확립",
      "사용자 중심 UI/UX 설계 경험",
    ],
  },
];
