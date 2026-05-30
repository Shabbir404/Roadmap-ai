/**
 * Curated career roadmaps for built-in templates — each role has unique phases & topics.
 * Keys: topic (lowercase) → career title (lowercase) → roadmap JSON.
 */

const ROADMAPS = {
    'python programming': {
        'data analyst': {
            title: 'Data Analyst Roadmap via Python',
            intro: 'Data analysts turn raw numbers into decisions. Python plus pandas, SQL, and visualization tools is the fastest path into this role. Most junior analysts land within 6–9 months of focused practice.',
            phases: [
                {
                    id: 1, emoji: '📊', color: '#3B82F6',
                    title: 'Analytics Python Stack', duration: 'Weeks 1–4',
                    summary: 'pandas, NumPy, and Jupyter — your daily toolkit.',
                    topics: [
                        { id: 1, title: 'pandas DataFrames', description: 'Filter, group, merge, and reshape business data.' },
                        { id: 2, title: 'NumPy for Calculations', description: 'Aggregations, percentages, and growth metrics.' },
                        { id: 3, title: 'Jupyter Notebooks', description: 'Document analysis steps stakeholders can follow.' },
                    ],
                },
                {
                    id: 2, emoji: '🗄️', color: '#8B5CF6',
                    title: 'SQL & Data Wrangling', duration: 'Weeks 5–8',
                    summary: 'Pull and clean data from real databases.',
                    topics: [
                        { id: 1, title: 'SQL Queries (JOINs & GROUP BY)', description: 'Write queries analysts use every day.' },
                        { id: 2, title: 'Data Cleaning Patterns', description: 'Handle nulls, duplicates, and bad formats.' },
                        { id: 3, title: 'Connecting Python to Databases', description: 'Use sqlite3 or SQLAlchemy in scripts.' },
                    ],
                },
                {
                    id: 3, emoji: '📈', color: '#2DD4BF',
                    title: 'Visualization & Storytelling', duration: 'Weeks 9–12',
                    summary: 'Charts that answer business questions clearly.',
                    topics: [
                        { id: 1, title: 'matplotlib & seaborn', description: 'Bar, line, and distribution plots.' },
                        { id: 2, title: 'Dashboard Basics', description: 'Build a simple Streamlit or Plotly dashboard.' },
                        { id: 3, title: 'Writing Insights', description: 'Turn findings into executive summaries.' },
                    ],
                },
                {
                    id: 4, emoji: '💼', color: '#F59E0B',
                    title: 'Portfolio & Interviews', duration: 'Weeks 13–16',
                    summary: 'Prove you can analyze real datasets.',
                    topics: [
                        { id: 1, title: 'Kaggle / Public Dataset Project', description: 'End-to-end analysis with write-up.' },
                        { id: 2, title: 'Excel + Python Hybrid Skills', description: 'What hiring managers still expect.' },
                        { id: 3, title: 'Analyst Interview Questions', description: 'SQL tests, case studies, and take-homes.' },
                    ],
                },
            ],
        },
        'ml engineer': {
            title: 'ML Engineer Roadmap via Python',
            intro: 'ML engineers ship models to production — not just notebooks. You need solid Python, ML fundamentals, and deployment skills. Plan for 9–14 months before your first ML engineering role.',
            phases: [
                {
                    id: 1, emoji: '🧮', color: '#8B5CF6',
                    title: 'ML Foundations in Python', duration: 'Weeks 1–5',
                    summary: 'scikit-learn, evaluation, and feature pipelines.',
                    topics: [
                        { id: 1, title: 'scikit-learn Workflows', description: 'Train, validate, and tune classic models.' },
                        { id: 2, title: 'Train/Test Splits & Cross-Validation', description: 'Avoid overfitting before production.' },
                        { id: 3, title: 'Feature Pipelines', description: 'Encode, scale, and transform inputs reliably.' },
                    ],
                },
                {
                    id: 2, emoji: '🔥', color: '#2DD4BF',
                    title: 'Deep Learning Basics', duration: 'Weeks 6–10',
                    summary: 'Neural networks with PyTorch or TensorFlow.',
                    topics: [
                        { id: 1, title: 'PyTorch Fundamentals', description: 'Tensors, autograd, and training loops.' },
                        { id: 2, title: 'CNNs for Structured Data', description: 'When and how to use deep models.' },
                        { id: 3, title: 'Transfer Learning', description: 'Fine-tune pre-trained models fast.' },
                    ],
                },
                {
                    id: 3, emoji: '🚀', color: '#F59E0B',
                    title: 'Model Serving & MLOps', duration: 'Weeks 11–14',
                    summary: 'Get models off your laptop and into APIs.',
                    topics: [
                        { id: 1, title: 'FastAPI Model Endpoints', description: 'Serve predictions over REST.' },
                        { id: 2, title: 'Docker for ML Services', description: 'Package models with dependencies.' },
                        { id: 3, title: 'Model Versioning', description: 'Track experiments with MLflow or similar.' },
                    ],
                },
                {
                    id: 4, emoji: '💼', color: '#EC4899',
                    title: 'Production Portfolio', duration: 'Weeks 15–18',
                    summary: 'Projects that show you can deploy, not just train.',
                    topics: [
                        { id: 1, title: 'End-to-End ML Project', description: 'Data → model → API → simple frontend.' },
                        { id: 2, title: 'Monitoring & Retraining', description: 'Handle drift and failed predictions.' },
                        { id: 3, title: 'ML Engineer Interviews', description: 'System design and coding on ML pipelines.' },
                    ],
                },
            ],
        },
        'backend developer': {
            title: 'Backend Developer Roadmap via Python',
            intro: 'Backend developers build the APIs and services users never see. Python with FastAPI or Django is a proven stack for startups and enterprises alike. Most juniors break in within 8–12 months.',
            phases: [
                {
                    id: 1, emoji: '🌐', color: '#2DD4BF',
                    title: 'HTTP & REST Fundamentals', duration: 'Weeks 1–4',
                    summary: 'How the web works before you build on it.',
                    topics: [
                        { id: 1, title: 'HTTP Methods & Status Codes', description: 'GET, POST, PUT, DELETE and when to use each.' },
                        { id: 2, title: 'REST API Design', description: 'Resources, routes, and JSON contracts.' },
                        { id: 3, title: 'Postman & API Testing', description: 'Test endpoints before writing a frontend.' },
                    ],
                },
                {
                    id: 2, emoji: '⚡', color: '#3B82F6',
                    title: 'FastAPI / Django', duration: 'Weeks 5–9',
                    summary: 'Build real APIs with authentication.',
                    topics: [
                        { id: 1, title: 'FastAPI Routing & Validation', description: 'Pydantic models and automatic docs.' },
                        { id: 2, title: 'Database ORM (SQLAlchemy)', description: 'CRUD operations with PostgreSQL.' },
                        { id: 3, title: 'JWT Authentication', description: 'Secure endpoints for logged-in users.' },
                    ],
                },
                {
                    id: 3, emoji: '🔧', color: '#8B5CF6',
                    title: 'Production Patterns', duration: 'Weeks 10–13',
                    summary: 'Caching, background jobs, and error handling.',
                    topics: [
                        { id: 1, title: 'Background Tasks (Celery/RQ)', description: 'Email, exports, and async work.' },
                        { id: 2, title: 'Redis Caching', description: 'Speed up read-heavy endpoints.' },
                        { id: 3, title: 'Logging & Error Middleware', description: 'Debug production issues quickly.' },
                    ],
                },
                {
                    id: 4, emoji: '💼', color: '#F59E0B',
                    title: 'Ship & Get Hired', duration: 'Weeks 14–17',
                    summary: 'Deploy a backend employers can click.',
                    topics: [
                        { id: 1, title: 'Full API Project', description: 'Auth, CRUD, and docs on Railway/Render.' },
                        { id: 2, title: 'GitHub Actions CI', description: 'Run tests on every push.' },
                        { id: 3, title: 'Backend Interview Prep', description: 'SQL, system design, and live coding.' },
                    ],
                },
            ],
        },
        'devops engineer': {
            title: 'DevOps Engineer Roadmap via Python',
            intro: 'DevOps engineers automate infrastructure and keep releases smooth. Python scripts glue together CI/CD, cloud APIs, and monitoring. Expect 10–14 months to reach an entry-level DevOps role.',
            phases: [
                {
                    id: 1, emoji: '🐧', color: '#F59E0B',
                    title: 'Linux & Shell Automation', duration: 'Weeks 1–4',
                    summary: 'Terminal fluency and scripting basics.',
                    topics: [
                        { id: 1, title: 'Linux Admin Essentials', description: 'Users, permissions, processes, and systemd.' },
                        { id: 2, title: 'Bash Scripting', description: 'Automate repetitive server tasks.' },
                        { id: 3, title: 'Python for DevOps Scripts', description: 'Parse logs, call APIs, batch operations.' },
                    ],
                },
                {
                    id: 2, emoji: '🐳', color: '#2DD4BF',
                    title: 'Containers & CI/CD', duration: 'Weeks 5–9',
                    summary: 'Docker pipelines that deploy on every merge.',
                    topics: [
                        { id: 1, title: 'Docker & Docker Compose', description: 'Build, run, and multi-service stacks.' },
                        { id: 2, title: 'GitHub Actions Pipelines', description: 'Test, build, and deploy automatically.' },
                        { id: 3, title: 'Infrastructure as Code Intro', description: 'Terraform or Pulumi basics.' },
                    ],
                },
                {
                    id: 3, emoji: '☁️', color: '#3B82F6',
                    title: 'Cloud & Monitoring', duration: 'Weeks 10–13',
                    summary: 'AWS/GCP basics plus observability.',
                    topics: [
                        { id: 1, title: 'AWS EC2 & S3', description: 'Compute, storage, and IAM fundamentals.' },
                        { id: 2, title: 'Kubernetes Intro', description: 'Pods, services, and deployments.' },
                        { id: 3, title: 'Prometheus & Grafana', description: 'Metrics, alerts, and dashboards.' },
                    ],
                },
                {
                    id: 4, emoji: '💼', color: '#8B5CF6',
                    title: 'DevOps Portfolio', duration: 'Weeks 14–17',
                    summary: 'Show automated deploys and uptime.',
                    topics: [
                        { id: 1, title: 'Deploy a Python App End-to-End', description: 'Docker → CI → cloud with HTTPS.' },
                        { id: 2, title: 'Incident Runbooks', description: 'Document how you would respond to outages.' },
                        { id: 3, title: 'DevOps Interview Topics', description: 'Linux, networking, and pipeline design.' },
                    ],
                },
            ],
        },
    },

    'react development': {
        'frontend developer': {
            title: 'Frontend Developer Roadmap via React',
            intro: 'Frontend developers craft the interfaces users touch every day. React plus modern CSS and accessibility skills open the most junior-friendly dev roles. Many land their first job in 6–10 months.',
            phases: [
                {
                    id: 1, emoji: '🎨', color: '#61DAFB',
                    title: 'UI Craft & Layout', duration: 'Weeks 1–4',
                    summary: 'Flexbox, Grid, and responsive React layouts.',
                    topics: [
                        { id: 1, title: 'CSS Grid & Flexbox in React', description: 'Build pixel-perfect responsive layouts.' },
                        { id: 2, title: 'Tailwind with React', description: 'Ship polished UI without custom CSS files.' },
                        { id: 3, title: 'Component Design Patterns', description: 'Reusable buttons, cards, and modals.' },
                    ],
                },
                {
                    id: 2, emoji: '⚛️', color: '#8B5CF6',
                    title: 'Advanced React Patterns', duration: 'Weeks 5–8',
                    summary: 'Hooks, context, and performance.',
                    topics: [
                        { id: 1, title: 'Custom Hooks', description: 'Extract logic shared across components.' },
                        { id: 2, title: 'React Context & Composition', description: 'Avoid prop drilling cleanly.' },
                        { id: 3, title: 'Memoization & Lazy Loading', description: 'Keep apps fast as they grow.' },
                    ],
                },
                {
                    id: 3, emoji: '♿', color: '#2DD4BF',
                    title: 'Accessibility & UX', duration: 'Weeks 9–11',
                    summary: 'Build interfaces everyone can use.',
                    topics: [
                        { id: 1, title: 'ARIA & Semantic HTML', description: 'Screen readers and keyboard navigation.' },
                        { id: 2, title: 'Form UX Best Practices', description: 'Validation, errors, and focus states.' },
                        { id: 3, title: 'Design Handoff Workflow', description: 'Figma → React with fidelity.' },
                    ],
                },
                {
                    id: 4, emoji: '💼', color: '#F59E0B',
                    title: 'Frontend Portfolio', duration: 'Weeks 12–15',
                    summary: 'Three projects recruiters will click.',
                    topics: [
                        { id: 1, title: 'Clone a Popular UI', description: 'Twitter, Spotify, or Notion-style rebuild.' },
                        { id: 2, title: 'Storybook Components', description: 'Document your design system.' },
                        { id: 3, title: 'Frontend Interview Prep', description: 'JS trivia, CSS challenges, React live coding.' },
                    ],
                },
            ],
        },
        'full stack developer': {
            title: 'Full Stack Developer Roadmap via React',
            intro: 'Full stack developers own both the UI and the API. React on the front plus Node or a Python backend makes you deployable solo. Plan 10–14 months for your first full stack role.',
            phases: [
                {
                    id: 1, emoji: '🔗', color: '#8B5CF6',
                    title: 'React + API Integration', duration: 'Weeks 1–4',
                    summary: 'Connect React to real backends.',
                    topics: [
                        { id: 1, title: 'fetch / axios Patterns', description: 'Loading states, errors, and retries.' },
                        { id: 2, title: 'React Query or SWR', description: 'Cache server data in the UI.' },
                        { id: 3, title: 'Auth Flows in React', description: 'Login, tokens, and protected routes.' },
                    ],
                },
                {
                    id: 2, emoji: '🖥️', color: '#61DAFB',
                    title: 'Node.js Backend', duration: 'Weeks 5–9',
                    summary: 'Express APIs that power your React app.',
                    topics: [
                        { id: 1, title: 'Express REST API', description: 'Routes, middleware, and validation.' },
                        { id: 2, title: 'MongoDB or PostgreSQL', description: 'Persist data your React app displays.' },
                        { id: 3, title: 'Session vs JWT Auth', description: 'Pick the right pattern for your stack.' },
                    ],
                },
                {
                    id: 3, emoji: '🚀', color: '#2DD4BF',
                    title: 'Full Stack Architecture', duration: 'Weeks 10–13',
                    summary: 'Monorepos, env vars, and deployment.',
                    topics: [
                        { id: 1, title: 'Monorepo or Separate Repos', description: 'Structure projects for solo or team work.' },
                        { id: 2, title: 'Environment & Secrets', description: '.env files without leaking keys.' },
                        { id: 3, title: 'Deploy Frontend + Backend', description: 'Vercel + Railway or similar combo.' },
                    ],
                },
                {
                    id: 4, emoji: '💼', color: '#F59E0B',
                    title: 'Full Stack Capstone', duration: 'Weeks 14–18',
                    summary: 'One app that proves you can ship alone.',
                    topics: [
                        { id: 1, title: 'SaaS MVP Project', description: 'Auth, dashboard, billing stub, and CRUD.' },
                        { id: 2, title: 'E2E Tests (Playwright)', description: 'Test critical user flows.' },
                        { id: 3, title: 'Full Stack Interviews', description: 'System design from browser to database.' },
                    ],
                },
            ],
        },
        'react native developer': {
            title: 'React Native Developer Roadmap via React',
            intro: 'React Native lets you build iOS and Android apps with React skills you already have. The mobile job market pays well and React Native talent is still scarce. Target 8–12 months to first mobile role.',
            phases: [
                {
                    id: 1, emoji: '📱', color: '#2DD4BF',
                    title: 'React Native Core', duration: 'Weeks 1–4',
                    summary: 'Components, navigation, and styling on mobile.',
                    topics: [
                        { id: 1, title: 'Expo Setup & Workflow', description: 'Fastest path from React web to mobile.' },
                        { id: 2, title: 'Core Components (View, Text, ScrollView)', description: 'Mobile equivalents of HTML elements.' },
                        { id: 3, title: 'React Navigation', description: 'Stack, tab, and drawer navigators.' },
                    ],
                },
                {
                    id: 2, emoji: '🎨', color: '#61DAFB',
                    title: 'Mobile UI & UX', duration: 'Weeks 5–8',
                    summary: 'Platform-specific patterns and gestures.',
                    topics: [
                        { id: 1, title: 'StyleSheet & Flexbox on Mobile', description: 'Layouts that feel native on both OSes.' },
                        { id: 2, title: 'Gestures & Animations', description: 'Reanimated and gesture handler basics.' },
                        { id: 3, title: 'Platform Differences (iOS vs Android)', description: 'Safe areas, back button, and permissions.' },
                    ],
                },
                {
                    id: 3, emoji: '🔌', color: '#8B5CF6',
                    title: 'Device APIs & Data', duration: 'Weeks 9–12',
                    summary: 'Camera, storage, and offline support.',
                    topics: [
                        { id: 1, title: 'AsyncStorage & Secure Store', description: 'Persist tokens and user preferences.' },
                        { id: 2, title: 'Camera & Image Picker', description: 'Common features in consumer apps.' },
                        { id: 3, title: 'Push Notifications', description: 'Engage users with Expo notifications.' },
                    ],
                },
                {
                    id: 4, emoji: '💼', color: '#F59E0B',
                    title: 'Publish & Portfolio', duration: 'Weeks 13–16',
                    summary: 'Ship to TestFlight and Play Store.',
                    topics: [
                        { id: 1, title: 'Build a Complete Mobile App', description: 'Auth, feed, and settings screens.' },
                        { id: 2, title: 'App Store & Play Store Submission', description: 'Icons, screenshots, and review process.' },
                        { id: 3, title: 'React Native Interview Prep', description: 'Bridge concepts, performance, and debugging.' },
                    ],
                },
            ],
        },
    },

    'machine learning': {
        'ml engineer': {
            title: 'ML Engineer Career Roadmap',
            intro: 'Production ML is about reliable pipelines, not Kaggle medals. This path focuses on training, serving, and monitoring models at scale. Senior ML engineers are among the highest-paid IC roles in tech.',
            phases: [
                {
                    id: 1, emoji: '⚙️', color: '#10B981',
                    title: 'Production ML Pipelines', duration: 'Weeks 1–5',
                    summary: 'From notebook experiments to repeatable jobs.',
                    topics: [
                        { id: 1, title: 'Feature Stores & Pipelines', description: 'Consistent features in train and serve.' },
                        { id: 2, title: 'Batch vs Online Inference', description: 'When to precompute vs predict live.' },
                        { id: 3, title: 'Data Validation (Great Expectations)', description: 'Catch bad data before it breaks models.' },
                    ],
                },
                {
                    id: 2, emoji: '🔥', color: '#8B5CF6',
                    title: 'Deep Learning at Scale', duration: 'Weeks 6–10',
                    summary: 'GPUs, distributed training, and optimization.',
                    topics: [
                        { id: 1, title: 'PyTorch Training Loops', description: 'Custom loops for production control.' },
                        { id: 2, title: 'Mixed Precision & GPU Tuning', description: 'Train faster without losing accuracy.' },
                        { id: 3, title: 'Model Compression', description: 'Quantization and pruning for edge deploy.' },
                    ],
                },
                {
                    id: 3, emoji: '🚀', color: '#F59E0B',
                    title: 'Serving & MLOps', duration: 'Weeks 11–14',
                    summary: 'Kubernetes, Triton, and CI for models.',
                    topics: [
                        { id: 1, title: 'Model Serving (TorchServe/Triton)', description: 'Low-latency prediction endpoints.' },
                        { id: 2, title: 'CI/CD for ML', description: 'Automated retrain and deploy pipelines.' },
                        { id: 3, title: 'A/B Testing Models', description: 'Measure impact in production safely.' },
                    ],
                },
                {
                    id: 4, emoji: '💼', color: '#3B82F6',
                    title: 'ML Engineer Career', duration: 'Weeks 15–18',
                    summary: 'Portfolio and system design interviews.',
                    topics: [
                        { id: 1, title: 'End-to-End ML Platform Project', description: 'Train → deploy → monitor one service.' },
                        { id: 2, title: 'ML System Design', description: 'Recommendations, search, or fraud pipelines.' },
                        { id: 3, title: 'ML Engineer Interviews', description: 'Coding, ML depth, and infra questions.' },
                    ],
                },
            ],
        },
        'data scientist': {
            title: 'Data Scientist Career Roadmap',
            intro: 'Data scientists blend statistics, experimentation, and modeling to answer hard business questions. You need stronger math than analysts but less infra focus than ML engineers. Typical path: 9–12 months.',
            phases: [
                {
                    id: 1, emoji: '📐', color: '#3B82F6',
                    title: 'Statistics for Decisions', duration: 'Weeks 1–5',
                    summary: 'Hypothesis tests, confidence, and causal thinking.',
                    topics: [
                        { id: 1, title: 'Hypothesis Testing & p-values', description: 'When results are statistically meaningful.' },
                        { id: 2, title: 'Regression Analysis', description: 'Linear and logistic models for prediction.' },
                        { id: 3, title: 'A/B Test Design', description: 'Sample size, power, and interpretation.' },
                    ],
                },
                {
                    id: 2, emoji: '🤖', color: '#10B981',
                    title: 'Predictive Modeling', duration: 'Weeks 6–10',
                    summary: 'Classical ML plus interpretability.',
                    topics: [
                        { id: 1, title: 'Ensemble Methods (RF, XGBoost)', description: 'Strong baselines for tabular data.' },
                        { id: 2, title: 'Model Interpretability (SHAP)', description: 'Explain predictions to stakeholders.' },
                        { id: 3, title: 'Time Series Forecasting', description: 'Trend, seasonality, and ARIMA basics.' },
                    ],
                },
                {
                    id: 3, emoji: '📊', color: '#8B5CF6',
                    title: 'Experimentation & Communication', duration: 'Weeks 11–14',
                    summary: 'Design experiments and tell the story.',
                    topics: [
                        { id: 1, title: 'Experimental Design', description: 'RCTs, quasi-experiments, and bias.' },
                        { id: 2, title: 'Stakeholder Presentations', description: 'Slides that drive decisions, not confusion.' },
                        { id: 3, title: 'SQL for Scientists', description: 'Complex joins and window functions.' },
                    ],
                },
                {
                    id: 4, emoji: '💼', color: '#F59E0B',
                    title: 'Data Science Portfolio', duration: 'Weeks 15–18',
                    summary: 'Case studies with business impact framing.',
                    topics: [
                        { id: 1, title: 'Business Case Study Project', description: 'Problem → analysis → recommendation.' },
                        { id: 2, title: 'Kaggle with Write-ups', description: 'Show process, not just leaderboard rank.' },
                        { id: 3, title: 'Data Science Interviews', description: 'SQL, probability, and modeling cases.' },
                    ],
                },
            ],
        },
        'ai researcher': {
            title: 'AI Researcher Career Roadmap',
            intro: 'AI researchers advance the field through papers, novel architectures, and rigorous experiments. This path is math-heavy and often requires grad school or exceptional open-source contributions. Plan 18+ months of deep study.',
            phases: [
                {
                    id: 1, emoji: '📚', color: '#8B5CF6',
                    title: 'Research Foundations', duration: 'Weeks 1–6',
                    summary: 'Linear algebra, optimization, and paper reading.',
                    topics: [
                        { id: 1, title: 'Matrix Calculus for ML', description: 'Gradients behind backprop and optimizers.' },
                        { id: 2, title: 'Reading arXiv Papers', description: 'Abstract → method → experiments workflow.' },
                        { id: 3, title: 'Reproducing Classic Papers', description: 'Implement attention or ResNet from scratch.' },
                    ],
                },
                {
                    id: 2, emoji: '🔬', color: '#10B981',
                    title: 'Modern Architectures', duration: 'Weeks 7–12',
                    summary: 'Transformers, diffusion, and RL basics.',
                    topics: [
                        { id: 1, title: 'Transformer Internals', description: 'Self-attention, positional encoding, blocks.' },
                        { id: 2, title: 'Fine-tuning & LoRA', description: 'Adapt large models efficiently.' },
                        { id: 3, title: 'Reinforcement Learning Intro', description: 'Policy gradients and reward design.' },
                    ],
                },
                {
                    id: 3, emoji: '🧪', color: '#2DD4BF',
                    title: 'Rigorous Experimentation', duration: 'Weeks 13–16',
                    summary: 'Baselines, ablations, and statistical rigor.',
                    topics: [
                        { id: 1, title: 'Ablation Studies', description: 'Prove each component actually helps.' },
                        { id: 2, title: 'Benchmark Reproduction', description: 'Match published numbers on standard sets.' },
                        { id: 3, title: 'Writing Research Notes', description: 'Blog posts that explain your findings clearly.' },
                    ],
                },
                {
                    id: 4, emoji: '🎓', color: '#F59E0B',
                    title: 'Research Career Path', duration: 'Weeks 17–20',
                    summary: 'PhD apps, labs, and industry research roles.',
                    topics: [
                        { id: 1, title: 'Open-Source Research Project', description: 'Novel tweak with public code and results.' },
                        { id: 2, title: 'Conference Submission Basics', description: 'NeurIPS/ICML paper structure overview.' },
                        { id: 3, title: 'Research Interview Prep', description: 'Paper discussions and research proposals.' },
                    ],
                },
            ],
        },
    },

    'ui/ux design': {
        'ui designer': {
            title: 'UI Designer Career Roadmap',
            intro: 'UI designers focus on visual craft — typography, color, spacing, and component systems. You do not need to code, but Figma mastery and a sharp portfolio get you hired. Many land roles in 4–8 months.',
            phases: [
                {
                    id: 1, emoji: '🎨', color: '#EC4899',
                    title: 'Visual Design Systems', duration: 'Weeks 1–4',
                    summary: 'Color, type, and spacing at scale.',
                    topics: [
                        { id: 1, title: 'Design Tokens & Variables', description: 'Consistent colors and spacing in Figma.' },
                        { id: 2, title: 'Typography Hierarchy', description: 'Headlines, body, captions that guide the eye.' },
                        { id: 3, title: 'Iconography & Illustration Style', description: 'Cohesive visual language across screens.' },
                    ],
                },
                {
                    id: 2, emoji: '🧩', color: '#8B5CF6',
                    title: 'Component Libraries', duration: 'Weeks 5–8',
                    summary: 'Build reusable UI kits like real product teams.',
                    topics: [
                        { id: 1, title: 'Atomic Design in Figma', description: 'Atoms → molecules → organisms.' },
                        { id: 2, title: 'Variants & Auto Layout', description: 'Buttons and inputs that scale.' },
                        { id: 3, title: 'Dark Mode & Theming', description: 'Dual themes without doubling work.' },
                    ],
                },
                {
                    id: 3, emoji: '📱', color: '#2DD4BF',
                    title: 'Multi-Platform UI', duration: 'Weeks 9–11',
                    summary: 'Web, iOS, and Android visual patterns.',
                    topics: [
                        { id: 1, title: 'iOS HIG vs Material Design', description: 'Platform-native feel matters.' },
                        { id: 2, title: 'Responsive Web Layouts', description: 'Desktop, tablet, and mobile breakpoints.' },
                        { id: 3, title: 'Micro-interactions in Figma', description: 'Hover, press, and transition specs.' },
                    ],
                },
                {
                    id: 4, emoji: '💼', color: '#F59E0B',
                    title: 'UI Portfolio & Jobs', duration: 'Weeks 12–15',
                    summary: 'Dribbble-ready work and interview prep.',
                    topics: [
                        { id: 1, title: 'Redesign a Known App', description: 'Before/after with rationale.' },
                        { id: 2, title: 'Design System Case Study', description: 'Document tokens, components, and usage.' },
                        { id: 3, title: 'UI Designer Interviews', description: 'Portfolio review and live design challenges.' },
                    ],
                },
            ],
        },
        'ux researcher': {
            title: 'UX Researcher Career Roadmap',
            intro: 'UX researchers uncover what users need through interviews, tests, and data. You translate human behavior into design direction. Strong communicators with empathy thrive here — timeline to first role: 6–10 months.',
            phases: [
                {
                    id: 1, emoji: '🔍', color: '#8B5CF6',
                    title: 'Qualitative Research Methods', duration: 'Weeks 1–4',
                    summary: 'Interviews, diary studies, and synthesis.',
                    topics: [
                        { id: 1, title: 'User Interview Techniques', description: 'Open questions without leading answers.' },
                        { id: 2, title: 'Affinity Mapping', description: 'Cluster insights into themes.' },
                        { id: 3, title: 'Personas & Jobs-to-be-Done', description: 'Frame users by goals, not demographics.' },
                    ],
                },
                {
                    id: 2, emoji: '🧪', color: '#2DD4BF',
                    title: 'Usability Testing', duration: 'Weeks 5–8',
                    summary: 'Moderated and unmoderated test design.',
                    topics: [
                        { id: 1, title: 'Test Script Writing', description: 'Tasks that reveal real friction.' },
                        { id: 2, title: 'Remote Testing Tools (Maze, UserTesting)', description: 'Run studies without a lab.' },
                        { id: 3, title: 'Severity Rating & Prioritization', description: 'Turn findings into a fix backlog.' },
                    ],
                },
                {
                    id: 3, emoji: '📊', color: '#3B82F6',
                    title: 'Quant UX & Analytics', duration: 'Weeks 9–11',
                    summary: 'Surveys, metrics, and mixed methods.',
                    topics: [
                        { id: 1, title: 'Survey Design Basics', description: 'Avoid biased questions and low response.' },
                        { id: 2, title: 'Product Analytics (Mixpanel/Amplitude)', description: 'Funnels, cohorts, and drop-off.' },
                        { id: 3, title: 'Research Repositories', description: 'Dovetail or Notion for insight libraries.' },
                    ],
                },
                {
                    id: 4, emoji: '💼', color: '#F59E0B',
                    title: 'UX Research Portfolio', duration: 'Weeks 12–15',
                    summary: 'Case studies that show your process.',
                    topics: [
                        { id: 1, title: 'End-to-End Research Case Study', description: 'Plan → conduct → synthesize → recommend.' },
                        { id: 2, title: 'Stakeholder Readouts', description: 'Present findings that change roadmaps.' },
                        { id: 3, title: 'UX Research Interviews', description: 'Methodology questions and portfolio deep dives.' },
                    ],
                },
            ],
        },
        'product designer': {
            title: 'Product Designer Career Roadmap',
            intro: 'Product designers own the full experience — research, flows, UI, and collaboration with engineering. You sit at the intersection of user needs and business goals. Most break in within 8–12 months with strong case studies.',
            phases: [
                {
                    id: 1, emoji: '🗺️', color: '#2DD4BF',
                    title: 'Product Thinking', duration: 'Weeks 1–4',
                    summary: 'Problems, metrics, and user journeys.',
                    topics: [
                        { id: 1, title: 'Problem Framing Workshops', description: 'Define the right problem before pixels.' },
                        { id: 2, title: 'User Journey & Service Blueprints', description: 'Map touchpoints beyond the screen.' },
                        { id: 3, title: 'North Star Metrics', description: 'Tie design work to business outcomes.' },
                    ],
                },
                {
                    id: 2, emoji: '✏️', color: '#EC4899',
                    title: 'Flows & Prototyping', duration: 'Weeks 5–8',
                    summary: 'Wireframes to high-fidelity prototypes.',
                    topics: [
                        { id: 1, title: 'Low-Fi Wireframing', description: 'Speed through ideas before polish.' },
                        { id: 2, title: 'Interactive Prototypes', description: 'Clickable flows for stakeholder buy-in.' },
                        { id: 3, title: 'Design Critique Skills', description: 'Give and receive feedback constructively.' },
                    ],
                },
                {
                    id: 3, emoji: '🤝', color: '#8B5CF6',
                    title: 'Cross-Functional Collaboration', duration: 'Weeks 9–11',
                    summary: 'Work with PMs and engineers effectively.',
                    topics: [
                        { id: 1, title: 'PRD & Design Spec Handoff', description: 'Document states, edge cases, and behavior.' },
                        { id: 2, title: 'Design QA with Engineers', description: 'Catch implementation drift early.' },
                        { id: 3, title: 'Prioritization Frameworks', description: 'RICE, impact/effort, and roadmap tradeoffs.' },
                    ],
                },
                {
                    id: 4, emoji: '💼', color: '#F59E0B',
                    title: 'Product Design Portfolio', duration: 'Weeks 12–16',
                    summary: 'Three case studies that show end-to-end ownership.',
                    topics: [
                        { id: 1, title: '0→1 Feature Case Study', description: 'Discovery through shipped MVP.' },
                        { id: 2, title: 'Redesign with Measured Impact', description: 'Before/after with metric narrative.' },
                        { id: 3, title: 'Product Design Interviews', description: 'Whiteboard challenges and app critiques.' },
                    ],
                },
            ],
        },
    },

    'cybersecurity': {
        'security engineer': {
            title: 'Security Engineer Career Roadmap',
            intro: 'Security engineers design defenses — IAM, encryption, secure architecture, and compliance. You think like an attacker but build like a defender. Entry roles often follow 10–14 months of hands-on labs and certs.',
            phases: [
                {
                    id: 1, emoji: '🏗️', color: '#EF4444',
                    title: 'Secure Architecture', duration: 'Weeks 1–5',
                    summary: 'Design systems that fail safely.',
                    topics: [
                        { id: 1, title: 'Zero Trust Principles', description: 'Never trust, always verify — in practice.' },
                        { id: 2, title: 'Identity & Access Management', description: 'OAuth, SAML, and least privilege.' },
                        { id: 3, title: 'Encryption at Rest & in Transit', description: 'TLS, AES, and key management basics.' },
                    ],
                },
                {
                    id: 2, emoji: '☁️', color: '#3B82F6',
                    title: 'Cloud Security', duration: 'Weeks 6–10',
                    summary: 'Secure AWS/Azure workloads.',
                    topics: [
                        { id: 1, title: 'AWS IAM & Security Groups', description: 'Lock down EC2, S3, and Lambda.' },
                        { id: 2, title: 'Container Security', description: 'Image scanning and runtime protection.' },
                        { id: 3, title: 'Secrets Management (Vault)', description: 'No keys in code or env leaks.' },
                    ],
                },
                {
                    id: 3, emoji: '🛡️', color: '#2DD4BF',
                    title: 'Detection & Response', duration: 'Weeks 11–14',
                    summary: 'SIEM, logging, and incident playbooks.',
                    topics: [
                        { id: 1, title: 'SIEM Rule Writing', description: 'Detect suspicious auth and lateral movement.' },
                        { id: 2, title: 'Incident Response Runbooks', description: 'Contain, eradicate, recover, learn.' },
                        { id: 3, title: 'Threat Modeling (STRIDE)', description: 'Find flaws before attackers do.' },
                    ],
                },
                {
                    id: 4, emoji: '💼', color: '#F59E0B',
                    title: 'Security Engineer Career', duration: 'Weeks 15–18',
                    summary: 'Certs, homelabs, and interviews.',
                    topics: [
                        { id: 1, title: 'Security+ or CCNA Security Path', description: 'Baseline cert many employers want.' },
                        { id: 2, title: 'Homelab Security Project', description: 'Harden a small cloud environment end-to-end.' },
                        { id: 3, title: 'Security Engineer Interviews', description: 'Architecture scenarios and IR walkthroughs.' },
                    ],
                },
            ],
        },
        'penetration tester': {
            title: 'Penetration Tester Career Roadmap',
            intro: 'Pen testers break into systems legally to find flaws before criminals do. Offensive skills, report writing, and curiosity drive success. Most enter via certs plus HackTheBox experience — 8–12 months of grinding.',
            phases: [
                {
                    id: 1, emoji: '🎯', color: '#8B5CF6',
                    title: 'Recon & Enumeration', duration: 'Weeks 1–4',
                    summary: 'Find attack surface like a real adversary.',
                    topics: [
                        { id: 1, title: 'OSINT Techniques', description: 'Subdomains, emails, and leaked creds.' },
                        { id: 2, title: 'Nmap & Service Fingerprinting', description: 'Map open ports and versions.' },
                        { id: 3, title: 'Web Enumeration (gobuster, ffuf)', description: 'Hidden dirs, params, and vhosts.' },
                    ],
                },
                {
                    id: 2, emoji: '💉', color: '#EF4444',
                    title: 'Web & Network Exploitation', duration: 'Weeks 5–9',
                    summary: 'Classic vulns that still pay bounties.',
                    topics: [
                        { id: 1, title: 'SQL Injection & XSS', description: 'Manual exploitation beyond automated scans.' },
                        { id: 2, title: 'Authentication Bypass', description: 'JWT flaws, session fixation, IDOR.' },
                        { id: 3, title: 'Metasploit & Manual Exploits', description: 'When and how to use frameworks.' },
                    ],
                },
                {
                    id: 3, emoji: '🖥️', color: '#2DD4BF',
                    title: 'Active Directory Attacks', duration: 'Weeks 10–13',
                    summary: 'Enterprise pentest bread and butter.',
                    topics: [
                        { id: 1, title: 'Kerberoasting & AS-REP Roasting', description: 'Common AD misconfigurations.' },
                        { id: 2, title: 'Lateral Movement', description: 'Pass-the-hash and pivoting techniques.' },
                        { id: 3, title: 'Privilege Escalation on Linux/Windows', description: 'Local exploits and misconfigs.' },
                    ],
                },
                {
                    id: 4, emoji: '💼', color: '#F59E0B',
                    title: 'Pentest Career Launch', duration: 'Weeks 14–17',
                    summary: 'Reports, certs, and bug bounties.',
                    topics: [
                        { id: 1, title: 'Professional Pentest Reports', description: 'Executive summary plus technical PoC.' },
                        { id: 2, title: 'OSCP / eJPT Prep Path', description: 'Structured cert that opens doors.' },
                        { id: 3, title: 'Bug Bounty First Findings', description: 'HackerOne/Bugcrowd methodology.' },
                    ],
                },
            ],
        },
        'soc analyst': {
            title: 'SOC Analyst Career Roadmap',
            intro: 'SOC analysts are the front line — monitoring alerts, triaging incidents, and escalating threats. It is one of the most accessible entry points into cybersecurity. Many land SOC Tier 1 roles within 6–9 months.',
            phases: [
                {
                    id: 1, emoji: '📡', color: '#2DD4BF',
                    title: 'Security Monitoring Basics', duration: 'Weeks 1–4',
                    summary: 'Logs, alerts, and the SOC workflow.',
                    topics: [
                        { id: 1, title: 'Log Sources (Windows, Linux, Firewall)', description: 'What normal vs suspicious looks like.' },
                        { id: 2, title: 'SIEM Dashboard Navigation', description: 'Splunk or Elastic Security basics.' },
                        { id: 3, title: 'Alert Triage Process', description: 'Severity, false positives, escalation.' },
                    ],
                },
                {
                    id: 2, emoji: '🦠', color: '#EF4444',
                    title: 'Threat Detection', duration: 'Weeks 5–8',
                    summary: 'Malware, phishing, and lateral movement indicators.',
                    topics: [
                        { id: 1, title: 'Phishing Analysis', description: 'Headers, URLs, and sandbox detonation.' },
                        { id: 2, title: 'MITRE ATT&CK Mapping', description: 'Classify behaviors by tactic and technique.' },
                        { id: 3, title: 'EDR Alert Investigation', description: 'CrowdStrike/SentinelOne style workflows.' },
                    ],
                },
                {
                    id: 3, emoji: '🚨', color: '#8B5CF6',
                    title: 'Incident Response Tier 1', duration: 'Weeks 9–12',
                    summary: 'Containment steps analysts execute daily.',
                    topics: [
                        { id: 1, title: 'Isolate Hosts & Block IOCs', description: 'Stop spread while preserving evidence.' },
                        { id: 2, title: 'Ticket Documentation', description: 'Clear notes for Tier 2 and management.' },
                        { id: 3, title: 'Shift Handoff Procedures', description: 'Never lose context between rotations.' },
                    ],
                },
                {
                    id: 4, emoji: '💼', color: '#F59E0B',
                    title: 'SOC Career Entry', duration: 'Weeks 13–16',
                    summary: 'Certs, labs, and interview scenarios.',
                    topics: [
                        { id: 1, title: 'Security+ & CySA+ Path', description: 'Certs SOC hiring managers recognize.' },
                        { id: 2, title: 'Blue Team Labs Online', description: 'Simulated alert investigations.' },
                        { id: 3, title: 'SOC Analyst Interviews', description: 'Alert walkthroughs and scenario questions.' },
                    ],
                },
            ],
        },
    },

    'flutter mobile development': {
        'flutter developer': {
            title: 'Flutter Developer Career Roadmap',
            intro: 'Flutter developers ship one codebase to iOS, Android, and beyond. Demand is growing fast and competition is lower than native-only paths. With consistent practice, first mobile roles come in 6–10 months.',
            phases: [
                {
                    id: 1, emoji: '📱', color: '#A78BFA',
                    title: 'Flutter Architecture', duration: 'Weeks 1–4',
                    summary: 'Clean structure for apps that scale.',
                    topics: [
                        { id: 1, title: 'Folder Structure & Feature Modules', description: 'Organize code beyond the default template.' },
                        { id: 2, title: 'State Management (Riverpod/Bloc)', description: 'Pick a pattern and use it consistently.' },
                        { id: 3, title: 'Navigation 2.0 / go_router', description: 'Deep links and nested navigation.' },
                    ],
                },
                {
                    id: 2, emoji: '🎨', color: '#3B82F6',
                    title: 'Custom UI & Animations', duration: 'Weeks 5–8',
                    summary: 'Polished interfaces that feel native.',
                    topics: [
                        { id: 1, title: 'Custom Painters & Clippers', description: 'Unique shapes beyond stock widgets.' },
                        { id: 2, title: 'Implicit & Explicit Animations', description: 'Hero, staggered, and controller animations.' },
                        { id: 3, title: 'Responsive Layouts', description: 'Phone, tablet, and foldable breakpoints.' },
                    ],
                },
                {
                    id: 3, emoji: '🔌', color: '#2DD4BF',
                    title: 'Backend & Offline', duration: 'Weeks 9–12',
                    summary: 'Firebase, REST, and local persistence.',
                    topics: [
                        { id: 1, title: 'Firebase Auth & Firestore', description: 'Real-time apps without a custom backend.' },
                        { id: 2, title: 'REST API Integration (dio)', description: 'Typed clients and error handling.' },
                        { id: 3, title: 'Offline-First with Hive/Drift', description: 'Sync when connectivity returns.' },
                    ],
                },
                {
                    id: 4, emoji: '💼', color: '#F59E0B',
                    title: 'Flutter Portfolio', duration: 'Weeks 13–16',
                    summary: 'Published apps and store listings.',
                    topics: [
                        { id: 1, title: 'Production App on Both Stores', description: 'Complete auth, settings, and core feature.' },
                        { id: 2, title: 'Performance Profiling', description: 'DevTools, jank, and build size.' },
                        { id: 3, title: 'Flutter Interview Prep', description: 'Widget tree, isolates, and platform channels.' },
                    ],
                },
            ],
        },
        'ios developer': {
            title: 'iOS Developer Career Roadmap via Flutter',
            intro: 'iOS developers build for Apple ecosystem — SwiftUI, App Store guidelines, and native performance. Flutter gets you building fast; adding Swift skills unlocks senior iOS roles. Plan 10–14 months for native iOS hiring.',
            phases: [
                {
                    id: 1, emoji: '🍎', color: '#3B82F6',
                    title: 'Swift Fundamentals', duration: 'Weeks 1–5',
                    summary: 'Swift syntax and Apple platform basics.',
                    topics: [
                        { id: 1, title: 'Swift Basics & Optionals', description: 'Types, guards, and safe unwrapping.' },
                        { id: 2, title: 'SwiftUI Views & State', description: 'Declarative UI the Apple way.' },
                        { id: 3, title: 'Xcode & Simulator Workflow', description: 'Debug, profile, and archive builds.' },
                    ],
                },
                {
                    id: 2, emoji: '📲', color: '#A78BFA',
                    title: 'Native iOS Patterns', duration: 'Weeks 6–10',
                    summary: 'UIKit bridges and Apple HIG compliance.',
                    topics: [
                        { id: 1, title: 'Navigation & Tab Controllers', description: 'Standard iOS app structure.' },
                        { id: 2, title: 'Core Data / SwiftData', description: 'Persist user data on device.' },
                        { id: 3, title: 'Human Interface Guidelines', description: 'Design patterns Apple reviewers expect.' },
                    ],
                },
                {
                    id: 3, emoji: '🔐', color: '#2DD4BF',
                    title: 'Apple Services & Release', duration: 'Weeks 11–14',
                    summary: 'Sign in with Apple, push, and TestFlight.',
                    topics: [
                        { id: 1, title: 'Sign in with Apple & Keychain', description: 'Secure auth the App Store prefers.' },
                        { id: 2, title: 'APNs Push Notifications', description: 'Register, send, and handle taps.' },
                        { id: 3, title: 'App Store Connect & Review', description: 'Metadata, screenshots, and rejection fixes.' },
                    ],
                },
                {
                    id: 4, emoji: '💼', color: '#F59E0B',
                    title: 'iOS Developer Career', duration: 'Weeks 15–18',
                    summary: 'Native apps on your portfolio.',
                    topics: [
                        { id: 1, title: 'SwiftUI App on App Store', description: 'Ship a polished native app solo.' },
                        { id: 2, title: 'Flutter + Swift Hybrid Story', description: 'Explain when to use each stack.' },
                        { id: 3, title: 'iOS Interview Prep', description: 'ARC, concurrency, and UIKit/SwiftUI trivia.' },
                    ],
                },
            ],
        },
    },
}

function normTopic(topic) {
    return (topic || '').trim().toLowerCase()
}

function normCareer(career) {
    return (career || '').trim().toLowerCase()
}

/** Lookup curated career roadmap for a built-in template topic + career title. */
export function getTemplateCareerRoadmap(topic, careerTitle) {
    const topicKey = normTopic(topic)
    const careerKey = normCareer(careerTitle)
    const roadmap = ROADMAPS[topicKey]?.[careerKey]
    if (!roadmap) return null
    return structuredClone(roadmap)
}

/** All template topic keys that have curated career roadmaps. */
export function hasTemplateCareerRoadmaps(topic) {
    return !!ROADMAPS[normTopic(topic)]
}
