export type Locale = "en" | "de" | "fr";

export const defaultLocale: Locale = "en";

const translations = {
  en: {
    onboarding: {
      brandName: "matura",
      steps: {
        start: "Start",
        projectMode: "Project Type",
        toolIdea: "Idea",
        usersRoles: "Users & Roles",
        workflows: "Workflows",
        files: "Files",
        review: "Review",
      },
      welcome: {
        greeting: "Hello, {{name}}",
        description:
          "We'll guide you through a few simple questions to understand what software you need. Just describe your idea in plain language — our AI will handle the rest and create a complete plan for you: vision, requirements, cost estimate, and more.",
        saveNote:
          "Your progress is saved automatically as you move through each step.",
        cta: "Let's get started!",
      },
      projectMode: {
        title: "What type of project is this?",
        description:
          "This determines how our AI agents operate — internal projects connect to your organization's tools and data, while external projects also run competitive analysis and pull public information.",
        internal: "Internal (On-Premise)",
        internalDesc:
          "Connects to internal tools and databases. For proprietary projects within your organization. No external data sources.",
        external: "External (Cloud)",
        externalDesc:
          "Runs competitive analysis against external sources. Can pull in public information to enrich your plan.",
      },
      toolIdea: {
        title: "Describe your idea",
        question:
          "What do you need to build? Describe the problem it solves and what it should do. The more detail you provide, the better the result.",
        placeholder:
          "e.g. We need an internal portal where employees can report IT incidents, support teams can triage and resolve them, and important fixes can become tracked change requests with approvals...",
      },
      usersRoles: {
        title: "Who will use this software?",
        description:
          "Tell us about the people who will use this software and what they should be able to do. This helps us design the right experience for each type of user.",
        rolesLabel: "What types of users will this software have?",
        rolesPlaceholder:
          "e.g. Admin, Team Lead, Regular Employee, Support Agent, Approver...",
        accessLabel:
          "Who should be able to do what?",
        accessPlaceholder:
          "e.g. Only admins can delete records, team leads can approve requests, employees can only see their own data...",
      },
      workflows: {
        title: "How should the software work?",
        description:
          "Walk us through the main processes. Think of it as explaining how work flows from start to finish.",
        keyWorkflowsLabel:
          "What are the main steps or processes?",
        keyWorkflowsPlaceholder:
          "e.g. Employee reports incident → Support triages → Assigns responder → Investigation → Resolution → Optional change request...",
        approvalsLabel:
          "Are there any approval or sign-off steps?",
        approvalsPlaceholder:
          "e.g. High-risk changes need two approvals, budget requests over $5k need manager sign-off...",
        notificationsLabel:
          "What notifications or reminders are needed?",
        notificationsPlaceholder:
          "e.g. Email reminders for overdue tasks, alerts when something is urgent, daily summary for managers...",
      },
      files: {
        title: "Any supporting documents?",
        description:
          "Upload any relevant files — briefs, process diagrams, existing spreadsheets, or notes. These help our AI understand your needs better. This step is optional.",
        dropzone: "Drag & drop files here, or click to browse",
        maxSize: "Max 10MB per file",
        noFiles: "No files uploaded yet",
        remove: "Remove",
      },
      review: {
        title: "Review your submission",
        toolIdeaLabel: "Software idea",
        projectModeLabel: "Project type",
        userRolesLabel: "User types",
        accessControlLabel: "Permissions",
        keyWorkflowsLabel: "Key processes",
        approvalsLabel: "Approvals",
        notificationsLabel: "Notifications",
        filesLabel: "Uploaded files",
        noFiles: "None",
        notProvided: "Not provided",
        submit: "Generate My Plan",
        submitting: "Generating...",
      },
      questions: {
        placeholder: "Type your answer here",
        continue: "Continue",
      },
      nav: {
        back: "Back",
        next: "Next",
        saveProgress: "Save Progress",
      },
    },
    dashboard: {
      title: "Business Dashboard",
      generating: "Our AI agents are analyzing your input and generating your plan...",
      vision: {
        title: "Vision",
        content:
          "A centralized internal portal that empowers employees to report IT incidents seamlessly, enables support teams to efficiently triage and resolve issues, and provides a structured change management process with approval workflows — improving response times, accountability, and operational transparency across the organization.",
      },
      requirements: {
        title: "Requirements",
        functional: "Functional Requirements",
        nonFunctional: "Non-Functional Requirements",
        items: [
          "Employees can submit incident reports with severity classification",
          "Support teams can triage, assign, and track incident resolution",
          "Resolved incidents can be escalated to tracked change requests",
          "Multi-level approval workflow for change requests based on risk",
          "Role-based access control (Employee, Support, Approver, Admin)",
          "Email and in-app notifications for status changes and assignments",
          "Full audit trail for all incidents and change requests",
          "Dashboard views with filtering by status, severity, and assignee",
        ],
        nfItems: [
          "Response time under 200ms for all UI interactions",
          "Support 500+ concurrent users",
          "99.9% uptime SLA",
          "GDPR compliant data handling",
          "SSO integration support",
        ],
      },
      cost: {
        title: "Cost Estimate",
        effort: "Estimated Effort",
        effortValue: "12-16 weeks",
        complexity: "Complexity",
        complexityValue: "Medium",
        team: "Suggested Team",
        teamValue: "2 Frontend, 2 Backend, 1 Designer, 1 PM",
        breakdown: "Effort Breakdown",
        phases: [
          { name: "Discovery & Design", weeks: "2-3 weeks", percent: 18 },
          { name: "Core Development", weeks: "5-7 weeks", percent: 42 },
          { name: "Integrations & Auth", weeks: "2-3 weeks", percent: 18 },
          { name: "Testing & QA", weeks: "2-3 weeks", percent: 15 },
          { name: "Deployment & Launch", weeks: "1 week", percent: 7 },
        ],
      },
      competitive: {
        title: "Competitive Analysis",
        description: "Similar tools and how your solution compares.",
        competitors: [
          {
            name: "ServiceNow",
            strength: "Enterprise-grade ITSM with deep integrations",
            gap: "Expensive, complex setup, overkill for smaller teams",
          },
          {
            name: "Jira Service Management",
            strength: "Strong ticketing and workflow engine",
            gap: "Limited change management, requires additional plugins",
          },
          {
            name: "Freshservice",
            strength: "User-friendly, good incident management",
            gap: "Weaker approval workflows, limited customization",
          },
        ],
        advantage:
          "Your software is purpose-built for your organization's specific workflows, combining incident management with change tracking in a single, simple interface — without the overhead of enterprise platforms.",
      },
    },
  },
  de: {
    onboarding: {
      brandName: "matura",
      steps: {
        start: "Start",
        projectMode: "Projekttyp",
        toolIdea: "Idee",
        usersRoles: "Benutzer & Rollen",
        workflows: "Workflows",
        files: "Dateien",
        review: "Uebersicht",
      },
      welcome: {
        greeting: "Hallo, {{name}}",
        description:
          "Wir fuehren Sie durch einige einfache Fragen, um zu verstehen, welche Software Sie benoetigen. Beschreiben Sie Ihre Idee einfach in Ihren eigenen Worten — unsere KI erledigt den Rest.",
        saveNote:
          "Ihr Fortschritt wird automatisch gespeichert, waehrend Sie die Schritte durchlaufen.",
        cta: "Los geht's!",
      },
      projectMode: {
        title: "Was fuer ein Projekttyp ist das?",
        description:
          "Dies bestimmt, wie unsere KI-Agenten arbeiten — interne Projekte verbinden sich mit den Tools Ihrer Organisation, externe Projekte fuehren zusaetzlich Wettbewerbsanalysen durch.",
        internal: "Intern (On-Premise)",
        internalDesc:
          "Verbindet sich mit internen Tools und Datenbanken. Fuer proprietaere Projekte innerhalb Ihrer Organisation.",
        external: "Extern (Cloud)",
        externalDesc:
          "Fuehrt Wettbewerbsanalysen durch. Kann oeffentliche Informationen einbeziehen.",
      },
      toolIdea: {
        title: "Beschreiben Sie Ihre Software-Idee",
        question:
          "Welche Software brauchen Sie? Beschreiben Sie das Problem und was es loesen soll. Je mehr Details, desto besser.",
        placeholder:
          "z.B. Wir brauchen ein internes Portal, in dem Mitarbeiter IT-Vorfaelle melden koennen...",
      },
      usersRoles: {
        title: "Wer wird diese Software nutzen?",
        description:
          "Erzaehlen Sie uns von den Personen, die diese Software verwenden werden und was sie tun koennen sollen.",
        rolesLabel: "Welche Benutzertypen wird diese Software haben?",
        rolesPlaceholder:
          "z.B. Admin, Teamleiter, Mitarbeiter, Support-Agent, Genehmiger...",
        accessLabel: "Wer soll was tun koennen?",
        accessPlaceholder:
          "z.B. Nur Admins koennen loeschen, Teamleiter koennen genehmigen...",
      },
      workflows: {
        title: "Wie soll die Software funktionieren?",
        description:
          "Beschreiben Sie die Hauptprozesse. Erklaeren Sie, wie die Arbeit von Anfang bis Ende ablaeuft.",
        keyWorkflowsLabel: "Was sind die Hauptschritte oder Prozesse?",
        keyWorkflowsPlaceholder:
          "z.B. Mitarbeiter meldet Vorfall → Support sichtet → Bearbeiter zuweisen → Loesung...",
        approvalsLabel: "Gibt es Genehmigungsschritte?",
        approvalsPlaceholder:
          "z.B. Hochrisiko-Aenderungen brauchen zwei Genehmigungen...",
        notificationsLabel: "Welche Benachrichtigungen werden benoetigt?",
        notificationsPlaceholder:
          "z.B. E-Mail-Erinnerungen fuer ueberfaellige Aufgaben, Warnungen bei Dringlichkeit...",
      },
      files: {
        title: "Unterstuetzende Dokumente?",
        description:
          "Laden Sie relevante Dateien hoch — Briefings, Prozessdiagramme, Tabellen oder Notizen. Dieser Schritt ist optional.",
        dropzone: "Dateien hierher ziehen oder klicken zum Durchsuchen",
        maxSize: "Max. 10 MB pro Datei",
        noFiles: "Noch keine Dateien hochgeladen",
        remove: "Entfernen",
      },
      review: {
        title: "Ihre Eingaben ueberpruefen",
        toolIdeaLabel: "Software-Idee",
        projectModeLabel: "Projekttyp",
        userRolesLabel: "Benutzertypen",
        accessControlLabel: "Berechtigungen",
        keyWorkflowsLabel: "Hauptprozesse",
        approvalsLabel: "Genehmigungen",
        notificationsLabel: "Benachrichtigungen",
        filesLabel: "Hochgeladene Dateien",
        noFiles: "Keine",
        notProvided: "Nicht angegeben",
        submit: "Meinen Plan erstellen",
        submitting: "Wird generiert...",
      },
      questions: {
        placeholder: "Geben Sie hier Ihre Antwort ein",
        continue: "Weiter",
      },
      nav: {
        back: "Zurueck",
        next: "Weiter",
        saveProgress: "Fortschritt speichern",
      },
    },
    dashboard: {
      title: "Business Dashboard",
      generating: "Unsere KI-Agenten analysieren Ihre Eingaben und erstellen Ihren Plan...",
      vision: { title: "Vision", content: "" },
      requirements: {
        title: "Anforderungen",
        functional: "Funktionale Anforderungen",
        nonFunctional: "Nicht-funktionale Anforderungen",
        items: [],
        nfItems: [],
      },
      cost: {
        title: "Kostenschaetzung",
        effort: "Geschaetzter Aufwand",
        effortValue: "",
        complexity: "Komplexitaet",
        complexityValue: "",
        team: "Vorgeschlagenes Team",
        teamValue: "",
        breakdown: "Aufwandsverteilung",
        phases: [],
      },
      competitive: {
        title: "Wettbewerbsanalyse",
        description: "",
        competitors: [],
        advantage: "",
      },
    },
  },
  fr: {
    onboarding: {
      brandName: "matura",
      steps: {
        start: "Debut",
        projectMode: "Type de projet",
        toolIdea: "Idee",
        usersRoles: "Utilisateurs & Roles",
        workflows: "Workflows",
        files: "Fichiers",
        review: "Revue",
      },
      welcome: {
        greeting: "Bonjour, {{name}}",
        description:
          "Nous allons vous guider avec quelques questions simples pour comprendre quel logiciel vous avez besoin. Decrivez votre idee simplement — notre IA s'occupe du reste.",
        saveNote:
          "Votre progression est sauvegardee automatiquement a chaque etape.",
        cta: "C'est parti !",
      },
      projectMode: {
        title: "Quel type de projet est-ce ?",
        description:
          "Cela determine comment nos agents IA fonctionnent — les projets internes se connectent aux outils de votre organisation, les projets externes effectuent des analyses concurrentielles.",
        internal: "Interne (On-Premise)",
        internalDesc:
          "Se connecte aux outils et bases de donnees internes de votre organisation.",
        external: "Externe (Cloud)",
        externalDesc:
          "Execute des analyses concurrentielles. Peut integrer des informations publiques.",
      },
      toolIdea: {
        title: "Decrivez votre idee de logiciel",
        question:
          "De quel logiciel avez-vous besoin ? Decrivez le probleme et ce qu'il devrait faire.",
        placeholder:
          "ex. Nous avons besoin d'un portail interne ou les employes peuvent signaler des incidents...",
      },
      usersRoles: {
        title: "Qui utilisera ce logiciel ?",
        description:
          "Parlez-nous des personnes qui utiliseront ce logiciel et de ce qu'elles devraient pouvoir faire.",
        rolesLabel: "Quels types d'utilisateurs ce logiciel aura-t-il ?",
        rolesPlaceholder:
          "ex. Admin, Chef d'equipe, Employe, Agent de support, Approbateur...",
        accessLabel: "Qui devrait pouvoir faire quoi ?",
        accessPlaceholder:
          "ex. Seuls les admins peuvent supprimer, les chefs d'equipe peuvent approuver...",
      },
      workflows: {
        title: "Comment le logiciel devrait-il fonctionner ?",
        description:
          "Decrivez les processus principaux. Expliquez comment le travail se deroule du debut a la fin.",
        keyWorkflowsLabel: "Quelles sont les etapes principales ?",
        keyWorkflowsPlaceholder:
          "ex. Employe signale un incident → Support trie → Resolution...",
        approvalsLabel: "Y a-t-il des etapes d'approbation ?",
        approvalsPlaceholder:
          "ex. Les changements a haut risque necessitent deux approbations...",
        notificationsLabel: "Quelles notifications sont necessaires ?",
        notificationsPlaceholder:
          "ex. Rappels par email, alertes pour les urgences...",
      },
      files: {
        title: "Documents d'appui ?",
        description:
          "Joignez des fichiers pertinents — briefs, diagrammes, tableurs. Cette etape est optionnelle.",
        dropzone: "Glissez-deposez des fichiers ici, ou cliquez pour parcourir",
        maxSize: "Max 10 Mo par fichier",
        noFiles: "Aucun fichier telecharge",
        remove: "Supprimer",
      },
      review: {
        title: "Verifiez votre soumission",
        toolIdeaLabel: "Idee de logiciel",
        projectModeLabel: "Type de projet",
        userRolesLabel: "Types d'utilisateurs",
        accessControlLabel: "Permissions",
        keyWorkflowsLabel: "Processus cles",
        approvalsLabel: "Approbations",
        notificationsLabel: "Notifications",
        filesLabel: "Fichiers telecharges",
        noFiles: "Aucun",
        notProvided: "Non fourni",
        submit: "Generer mon plan",
        submitting: "Generation en cours...",
      },
      questions: {
        placeholder: "Tapez votre reponse ici",
        continue: "Continuer",
      },
      nav: {
        back: "Retour",
        next: "Suivant",
        saveProgress: "Sauvegarder",
      },
    },
    dashboard: {
      title: "Tableau de bord",
      generating: "Nos agents IA analysent vos donnees et generent votre plan...",
      vision: { title: "Vision", content: "" },
      requirements: {
        title: "Exigences",
        functional: "Exigences fonctionnelles",
        nonFunctional: "Exigences non-fonctionnelles",
        items: [],
        nfItems: [],
      },
      cost: {
        title: "Estimation des couts",
        effort: "Effort estime",
        effortValue: "",
        complexity: "Complexite",
        complexityValue: "",
        team: "Equipe suggeree",
        teamValue: "",
        breakdown: "Repartition de l'effort",
        phases: [],
      },
      competitive: {
        title: "Analyse concurrentielle",
        description: "",
        competitors: [],
        advantage: "",
      },
    },
  },
} as const;

export type TranslationKeys = typeof translations.en;

export default translations;
