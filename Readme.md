# digiFolio
        
Project Blueprint: The "Command Center" Portfolio
Theme Name: DIGILAD. OS
Aesthetics: A clean, sophisticated, and strategic dark-mode interface. The mood is professional and high-tech, not cluttered or chaotic.
Iconography & UI Elements:
Icon Style: Minimalist, single-color line icons using #E0E0E0. Folders are represented by a folder outline; files get a document outline with the file extension (.exe, .log) centered inside.
Window Design: Windows have a 1px border in the primary accent color (#D98A57). The title bar is a solid bar of #282A36 containing the file icon and title.
Buttons: The close button is a simple 'X' icon. Links within windows are underlined and use the primary accent color on hover.
The Boot-Up Sequence
An animated, full-screen sequence.
Animation Style: Decrypted Text Effect.
Pacing: ~500ms to decrypt each line, ~200ms pause between lines, ~1000ms pause between steps.
Sequence:
ESTABLISHING SECURE CONNECTION...
CONNECTION SECURED.
AWAITING OPERATOR SIGNATURE...
INITIATING DIGILAD. OS [v2.0.25]
LOADING CORE MODULES...
module_cpp_algorithms.lib        [OK]
module_python_ai_ml.engine       [OK]
INITIALIZING OPERATING PRINCIPLES...
directive_community_builder.exe     [ACTIVE]
directive_empathetic_leadership.dll [ACTIVE]
protocol_knowledge_sharing.init     [ACTIVE]
protocol_environmental_impact.sys   [ACTIVE]
AUTHENTICATING OPERATOR...
OPERATOR ID: Le Viet Thanh Nhan
VALIDATING CREDENTIALS...
National Olympiad in Informatics [SECOND PRIZE]... VERIFIED 
Student Council [PRESIDENT]... VERIFIED
The Algitect Initiative [FOUNDER]... VERIFIED
AUTHENTICATION COMPLETE. ACCESS GRANTED.
PRIMARY DIRECTIVE: BUILD CODE. BUILD COMMUNITY.
RENDERING COMMAND CENTER INTERFACE...
WELCOME, NHAN.
The Desktop Environment
Wallpaper: An interactive, GSAP-powered dot grid.
Cursor: An animated, high-tech cursor.
Taskbar: 
Left: Personal logo. [Asset: personal_logo.svg]
Center: Displays icons and titles of open windows.
Right: Live clock, HH:MM:SS format (24-hour).
Desktop Icon Layout: Icons are arranged in a fixed grid starting from the top-left of the screen. They are not draggable.
Desktop Widgets:
Skills Matrix: Radar chart. Data: C++: 95, Python: 90, Web Dev: 85, AI/ML: 80, Leadership: 90.
Live Activity Feed: Ticker cycling logs. (4s display, 1s pause).
Responsive Design: Mobile/Tablet Fallback View
For screen widths below 1024px, the desktop interface is hidden.
A simplified, single-column, scrollable mobile view is shown instead.
This view presents the content from the windows as clean, sequential sections with titles.
Desktop Icons & Windows
Folder: PROJECT_ARCHIVES
ScamDetector.exe
Window Title: AI-Powered Scam Detector
Content: Links: Live Demo | Source Code, Tech Stack: React, Google Gemini API. Brief:  Media: [Asset: scam_detector_demo.mp4]
GNN_Vulnerability.research
Window Title: Research: Vulnerability of Graph Neural Networks
Content: Links: Jupyter Notebook | Full Paper, Brief: . Media: [Asset: gnn_results_graph.png]
Folder: LEADERSHIP_OPS
Student_Council.app
Window Title: Le Quy Don's Student Council - President
Content: Role: Led a 27-member council as the primary student-board liaison. Key Initiative: . Media: [Asset: student_council_app_screenshot.png]
The_Algitect.init
Window Title: The Algitect - Founder & President
Content: Mission: A student-led initiative to elevate informatics education. Impact: . Media: [Asset: the_algitect_logo.svg]
Icon: AGENT_PROFILE.id
Window Title: Operator Dossier
Content: Left Column: [Asset: professional_headshot.jpg]. Right Column: Name: Le Viet Thanh Nhan, Education: Le Quy Don High School for Gifted Students (Informatics), SAT: 1530, IELTS: 8.0, Bio: "."
Icon: ACHIEVEMENTS.log
Window Title: Honors and Awards
Content: Second prize winner, Vietnam National Olympiad in Informatics; Silver Medalist, Vietnam Artificial Intelligence Championship; Gold medalist, 29th Traditional Southern Vietnam Olympiad in Informatics; First prize winner, Provincial Olympiad in Informatics; Top 10%, Stanford Mathematics Tournament (Advanced Topics); AP Scholar with Distinction.
Icon: SECURE_COMMS.mail
Window Title: Contact
Content: Email: lvtnhan.418@gmail.com, Phone: (+84) 372 783 659, Links: [GitHub] | [LinkedIn].

Made with Floot.

# Instructions

For security reasons, the `env.json` file is not pre-populated — you will need to generate or retrieve the values yourself.  

For **JWT secrets**, generate a value with:  

```
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

Then paste the generated value into the appropriate field.  

For the **Floot Database**, download your database content as a pg_dump from the cog icon in the database view (right pane -> data -> floot data base -> cog icon on the left of the name), upload it to your own PostgreSQL database, and then fill in the connection string value.  

**Note:** Floot OAuth will not work in self-hosted environments.  

For other external services, retrieve your API keys and fill in the corresponding values.  

Once everything is configured, you can build and start the service with:  

```
npm install -g pnpm
pnpm install
pnpm vite build
pnpm tsx server.ts
```
