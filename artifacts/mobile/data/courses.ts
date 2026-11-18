export type CourseIcon = 'code' | 'layout' | 'zap' | 'server' | 'database';

export type Lesson = {
  id: string;
  title: string;
  minutes: number;
  objective: string;
  content: string;
  code: string;
  question: string;
  answers: string[];
  correctAnswer: number;
  explanation: string;
};

export type Course = {
  id: string;
  title: string;
  category: 'Web' | 'Frontend' | 'Backend' | 'Database';
  icon: CourseIcon;
  level: string;
  description: string;
  outcome: string;
  lessons: Lesson[];
};

export const courses: Course[] = [
  {
    id: 'html',
    title: 'HTML foundations',
    category: 'Web',
    icon: 'code',
    level: 'Beginner',
    description: 'Give every web page a clear, useful structure.',
    outcome: 'Build a simple page for a school club.',
    lessons: [
      {
        id: 'html-structure',
        title: 'The shape of a web page',
        minutes: 5,
        objective: 'Use headings and semantic page sections.',
        content:
          'HTML gives a page its meaning and structure. Think of it like organising a school noticeboard: a heading names the notice, paragraphs explain it, and sections keep related information together.',
        code: '<main>\n  <h1>Robotics Club</h1>\n  <p>We meet every Friday.</p>\n</main>',
        question: 'Which tag marks the main content of a page?',
        answers: ['<main>', '<small>', '<br>'],
        correctAnswer: 0,
        explanation:
          '<main> identifies the central content of the page. A page should normally have one main element.',
      },
      {
        id: 'html-links',
        title: 'Links that help people',
        minutes: 6,
        objective: 'Create links and describe images accessibly.',
        content:
          'Links connect pages or resources. The words inside a link should tell someone where it goes. Images need useful alternative text so people using a screen reader can understand what is shown.',
        code: '<a href="/clubs">Explore school clubs</a>\n<img src="team.jpg" alt="The robotics team at the expo">',
        question: 'What does the alt text on an image do?',
        answers: [
          'Describes the image for people and assistive technology',
          'Changes the image size',
          'Makes the image load faster',
        ],
        correctAnswer: 0,
        explanation:
          'Good alt text communicates the important information in an image when someone cannot see it.',
      },
      {
        id: 'html-forms',
        title: 'A form for your club',
        minutes: 7,
        objective: 'Connect a form label to an input.',
        content:
          'Forms collect information such as a club member’s name. A label makes each field clear, and its for value should match the input id so the two stay connected.',
        code: '<label for="student-name">Your name</label>\n<input id="student-name" name="name" type="text">',
        question: 'Why should a form input have a label?',
        answers: [
          'So people know what information to enter',
          'So the page has more colours',
          'So the browser can hide the input',
        ],
        correctAnswer: 0,
        explanation:
          'A clear label tells every learner what a field is for and also improves keyboard and screen-reader access.',
      },
    ],
  },
  {
    id: 'css',
    title: 'CSS styling',
    category: 'Frontend',
    icon: 'layout',
    level: 'Beginner',
    description: 'Make pages easier to read and enjoyable to use.',
    outcome: 'Style a page for a local community event.',
    lessons: [
      {
        id: 'css-selectors',
        title: 'Choose what to style',
        minutes: 5,
        objective: 'Write a CSS rule with a selector and declarations.',
        content:
          'CSS controls how HTML looks. A selector chooses the element; declarations inside the braces set its appearance. Keep text easy to read and make important actions stand out.',
        code: 'h1 {\n  color: #176c50;\n  font-size: 2rem;\n}',
        question: 'In this rule, what does h1 do?',
        answers: [
          'Selects the heading elements to style',
          'Creates a new HTML heading',
          'Names a JavaScript variable',
        ],
        correctAnswer: 0,
        explanation:
          'The selector h1 targets HTML heading elements. The declarations inside the braces describe their appearance.',
      },
      {
        id: 'css-box-model',
        title: 'Space around elements',
        minutes: 6,
        objective: 'Tell padding apart from margin.',
        content:
          'Every element behaves like a box. Padding is the space inside its border, between the content and the edge. Margin is the space outside the border, between neighbouring elements.',
        code: '.event-card {\n  padding: 16px;\n  margin: 12px 0;\n  border: 1px solid #ddd;\n}',
        question: 'Which property adds space inside an element’s border?',
        answers: ['margin', 'padding', 'border'],
        correctAnswer: 1,
        explanation:
          'Padding adds breathing room inside the border. Margin adds space outside it.',
      },
      {
        id: 'css-responsive',
        title: 'Design for every screen',
        minutes: 7,
        objective: 'Use a media query to adapt a layout.',
        content:
          'Learners may open your page on a small phone or a larger laptop. A media query lets your layout change at a chosen screen width, rather than forcing one design everywhere.',
        code: '.event-card {\n  width: 100%;\n}\n\n@media (min-width: 700px) {\n  .event-card {\n    max-width: 640px;\n  }\n}',
        question: 'When does this media query apply?',
        answers: [
          'When the screen is at least 700 pixels wide',
          'Only when the page is printed',
          'When the screen is less than 700 pixels wide',
        ],
        correctAnswer: 0,
        explanation:
          'min-width: 700px applies the enclosed styles when the viewport is 700 pixels wide or wider.',
      },
    ],
  },
  {
    id: 'javascript',
    title: 'JavaScript essentials',
    category: 'Frontend',
    icon: 'zap',
    level: 'Beginner',
    description: 'Add decisions and useful behaviour to a web page.',
    outcome: 'Make a small interactive fare calculator.',
    lessons: [
      {
        id: 'js-values',
        title: 'Store useful values',
        minutes: 5,
        objective: 'Choose between const and let.',
        content:
          'Variables give names to values your program uses. Use const when you will not assign a new value to that name. Use let when the value needs to change.',
        code: "const route = 'Kasarani to town';\nlet seatsLeft = 12;\nseatsLeft = seatsLeft - 1;",
        question: 'Which declaration fits a value that will not be reassigned?',
        answers: ['const', 'let', 'if'],
        correctAnswer: 0,
        explanation:
          'const makes it clear that the variable name will keep referring to the same value.',
      },
      {
        id: 'js-decisions',
        title: 'Make a decision',
        minutes: 6,
        objective: 'Use an if / else statement.',
        content:
          'A condition lets a program choose what to do. For example, a small fare tool can show one message for a student fare and another for the standard fare.',
        code: 'const isStudent = true;\n\nif (isStudent) {\n  showFare(50);\n} else {\n  showFare(80);\n}',
        question: 'When does the first block run?',
        answers: [
          'When isStudent is true',
          'Only when the page reloads',
          'When isStudent is a heading',
        ],
        correctAnswer: 0,
        explanation:
          'The code inside the if block runs when its condition evaluates to true.',
      },
      {
        id: 'js-functions',
        title: 'Make a reusable function',
        minutes: 7,
        objective: 'Pass an input to a function and return a result.',
        content:
          'Functions package a useful action so you can use it again. This one takes a fare and the number of rides, then returns the total cost in shillings.',
        code: 'function totalFare(fare, rides) {\n  return fare * rides;\n}\n\nconst cost = totalFare(50, 4);',
        question: 'What does totalFare(50, 4) return?',
        answers: ['200', '54', '50'],
        correctAnswer: 0,
        explanation:
          'The function multiplies the fare by the number of rides: 50 × 4 = 200.',
      },
    ],
  },
  {
    id: 'php',
    title: 'PHP for the web',
    category: 'Backend',
    icon: 'server',
    level: 'Beginner',
    description: 'Learn how a server can prepare a web page.',
    outcome: 'Create a simple server-side club welcome.',
    lessons: [
      {
        id: 'php-first-page',
        title: 'Your first PHP output',
        minutes: 5,
        objective: 'Recognise a PHP block and print a message.',
        content:
          'PHP runs on a web server. The opening and closing tags mark the PHP code, and echo writes text into the response the server sends back.',
        code: '<?php\n  echo "Welcome to the science club!";\n?>',
        question: 'Which PHP command writes text to the response?',
        answers: ['echo', 'printPage()', '<h1>'],
        correctAnswer: 0,
        explanation:
          'echo outputs text from PHP. The server can include that output in the HTML sent to a browser.',
      },
      {
        id: 'php-variables',
        title: 'Work with PHP values',
        minutes: 6,
        objective: 'Create variables and combine them with text.',
        content:
          'PHP variable names begin with a dollar sign. A variable can hold information such as a student’s first name, which you can use when preparing a greeting.',
        code: '<?php\n  $name = "Amina";\n  echo "Karibu, " . $name . "!";\n?>',
        question: 'What character starts a PHP variable name?',
        answers: ['$', '#', '@'],
        correctAnswer: 0,
        explanation:
          'PHP variables start with $. The dot joins strings together in this example.',
      },
      {
        id: 'php-decisions',
        title: 'Choose what to show',
        minutes: 7,
        objective: 'Use a condition to personalise a response.',
        content:
          'A server-side condition can show different content for different situations. This example checks a supplied name before building a greeting.',
        code: '<?php\n  if ($name !== "") {\n    echo "Hello, " . $name;\n  } else {\n    echo "Hello, learner";\n  }\n?>',
        question: 'What happens when $name is an empty string?',
        answers: [
          'The else block shows a general greeting',
          'The server creates a new database',
          'The if block runs anyway',
        ],
        correctAnswer: 0,
        explanation:
          'Because the name is empty, the condition is false and PHP runs the else block.',
      },
    ],
  },
  {
    id: 'mysql',
    title: 'MySQL database basics',
    category: 'Database',
    icon: 'database',
    level: 'Beginner',
    description: 'Organise information and ask a database questions.',
    outcome: 'Read a list of members from a club table.',
    lessons: [
      {
        id: 'mysql-tables',
        title: 'Organise information',
        minutes: 5,
        objective: 'Understand tables, rows, and columns.',
        content:
          'A database table is like a tidy register. Columns describe the kinds of information, such as name or year group. Each row stores one record, such as one club member.',
        code: 'CREATE TABLE members (\n  id INT PRIMARY KEY,\n  name VARCHAR(80),\n  club VARCHAR(60)\n);',
        question: 'In a table of members, what does one row usually represent?',
        answers: ['One member record', 'A column name', 'The whole database server'],
        correctAnswer: 0,
        explanation:
          'Each row is one record. The columns define the fields stored for that record.',
      },
      {
        id: 'mysql-read',
        title: 'Read with SELECT',
        minutes: 6,
        objective: 'Select named columns from a table.',
        content:
          'SELECT asks a database for information. Naming the columns you need is clearer than requesting every field, especially as a project grows.',
        code: 'SELECT name, club\nFROM members;',
        question: 'Which SQL command reads information from a table?',
        answers: ['SELECT', 'CHANGE', 'SHOWPAGE'],
        correctAnswer: 0,
        explanation:
          'SELECT reads the columns you name from the table after FROM.',
      },
      {
        id: 'mysql-filter',
        title: 'Find a matching record',
        minutes: 7,
        objective: 'Filter query results with WHERE.',
        content:
          'WHERE narrows a query to rows that match a condition. Here, the database returns only members of the coding club.',
        code: "SELECT name\nFROM members\nWHERE club = 'Coding';",
        question: 'What is the WHERE clause doing here?',
        answers: [
          'Keeping only rows where the club is Coding',
          'Creating a new column',
          'Renaming the members table',
        ],
        correctAnswer: 0,
        explanation:
          'WHERE filters the results, so only matching coding-club records are returned.',
      },
    ],
  },
];

export function findCourse(courseId: string | undefined) {
  return courses.find((course) => course.id === courseId);
}

export function findLesson(lessonId: string | undefined) {
  for (const course of courses) {
    const index = course.lessons.findIndex((lesson) => lesson.id === lessonId);
    if (index >= 0) {
      return { course, lesson: course.lessons[index], index };
    }
  }
  return undefined;
}
