export type CourseIcon = 'code' | 'layout' | 'zap' | 'server' | 'database';

export type PracticeCheck = {
  snippet: string;
  hint: string;
};

export type CodePractice = {
  instruction: string;
  starter: string;
  hint: string;
  checks: PracticeCheck[];
  successMessage: string;
};

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
  practice: CodePractice;
};

export function checkCodePractice(
  practice: CodePractice,
  submission: string,
): { isCorrect: boolean; feedback: string } {
  const normalizedSubmission = submission.trim().toLowerCase().replace(/\s+/g, ' ');
  if (!normalizedSubmission) {
    return { isCorrect: false, feedback: 'Start by writing a little code in the box.' };
  }

  const missingCheck = practice.checks.find((check) => {
    const snippet = check.snippet.toLowerCase().replace(/\s+/g, ' ');
    return !normalizedSubmission.includes(snippet);
  });

  if (missingCheck) {
    return { isCorrect: false, feedback: missingCheck.hint };
  }

  return { isCorrect: true, feedback: practice.successMessage };
}

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
        practice: {
          instruction: 'Add a heading and a sentence inside the main section.',
          starter: '<main>\n  <!-- Add your heading and sentence here -->\n</main>',
          hint: 'Use <h1> for the page heading and <p> for the sentence.',
          checks: [
            { snippet: '<h1>', hint: 'Add an opening <h1> tag for the main heading.' },
            { snippet: '</h1>', hint: 'Close the heading with </h1>.' },
            { snippet: '<p>', hint: 'Add a <p> tag for the sentence.' },
            { snippet: '</p>', hint: 'Close the sentence with </p>.' },
          ],
          successMessage: 'Great work. Your page now has a heading and a paragraph.',
        },
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
        practice: {
          instruction: 'Make the club link clear and describe the team photo.',
          starter: '<a href="/clubs">Add clear link words</a>\n<img src="team.jpg" alt="">',
          hint: 'Write words that explain where the link goes. Add a short description inside alt quotes.',
          checks: [
            { snippet: 'explore school clubs', hint: 'Use clear link words such as “Explore school clubs”.' },
            { snippet: 'alt="robotics club members"', hint: 'Describe who is in the photo in the alt text.' },
          ],
          successMessage: 'Nice work. The link and photo now make sense to more people.',
        },
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
        practice: {
          instruction: 'Connect a name label to a text input.',
          starter: '<!-- Add a label and a text input -->',
          hint: 'Give both the label’s for and the input’s id the same value: student-name.',
          checks: [
            { snippet: '<label for="student-name">', hint: 'Add a label with for="student-name".' },
            { snippet: 'your name</label>', hint: 'Give the label words that tell someone what to enter.' },
            { snippet: '<input id="student-name"', hint: 'Give the input id="student-name" to connect it.' },
            { snippet: 'type="text"', hint: 'Set the input type to text.' },
          ],
          successMessage: 'That label and input are connected and ready to use.',
        },
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
        practice: {
          instruction: 'Style the event title with a green colour and a larger size.',
          starter: '.event-title {\n  /* Add two style rules */\n}',
          hint: 'The property names are color and font-size. Put a colon after each name.',
          checks: [
            { snippet: '.event-title {', hint: 'Keep the .event-title selector so the right text is chosen.' },
            { snippet: 'color:', hint: 'Add a color property inside the braces.' },
            { snippet: 'font-size:', hint: 'Add a font-size property inside the braces.' },
          ],
          successMessage: 'Well done. Your CSS now chooses and styles the event title.',
        },
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
        practice: {
          instruction: 'Give the event card 16 pixels inside and 12 pixels outside.',
          starter: '.event-card {\n  /* Add padding and margin */\n}',
          hint: 'Use padding for inside space and margin for outside space.',
          checks: [
            { snippet: 'padding: 16px', hint: 'Add padding: 16px for space inside the card.' },
            { snippet: 'margin: 12px', hint: 'Add margin: 12px for space outside the card.' },
          ],
          successMessage: 'You used padding inside and margin outside the card.',
        },
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
        practice: {
          instruction: 'Let the card fill a phone, then limit it on wider screens.',
          starter: '.event-card {\n  width: 100%;\n}\n\n/* Add a 700px media query with a max-width rule */',
          hint: 'Start with @media (min-width: 700px), then set max-width inside it.',
          checks: [
            { snippet: '@media (min-width: 700px)', hint: 'Add a media query for screens at least 700 pixels wide.' },
            { snippet: 'max-width:', hint: 'Set a max-width for the card inside the media query.' },
          ],
          successMessage: 'Great. The card can adapt from a phone to a wider screen.',
        },
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
        practice: {
          instruction: 'Create a route name and count the seats after one person sits down.',
          starter: "const route = 'Kasarani to town';\nlet seatsLeft = 12;\n// Update seatsLeft by one",
          hint: 'Use let for the number that changes, then subtract 1 from seatsLeft.',
          checks: [
            { snippet: "const route = 'Kasarani to town'", hint: 'Keep the route in a const variable.' },
            { snippet: 'let seatsleft = 12', hint: 'Create seatsLeft with let because its value changes.' },
            { snippet: 'seatsleft = seatsleft - 1', hint: 'Subtract one and store the new value in seatsLeft.' },
          ],
          successMessage: 'Good job. The route stays the same and the seat count changes.',
        },
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
        practice: {
          instruction: 'Show a lower fare for a student and a standard fare for others.',
          starter: 'const isStudent = true;\n\n// Add an if / else decision',
          hint: 'Check isStudent. Use showFare(50) in if and showFare(80) in else.',
          checks: [
            { snippet: 'if (isstudent)', hint: 'Start with if (isStudent) to check the value.' },
            { snippet: 'showfare(50)', hint: 'Show 50 inside the student if block.' },
            { snippet: 'else', hint: 'Add an else block for everyone else.' },
            { snippet: 'showfare(80)', hint: 'Show 80 inside the else block.' },
          ],
          successMessage: 'Your program now picks the right fare for each situation.',
        },
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
        practice: {
          instruction: 'Write a function that multiplies a fare by the number of rides.',
          starter: 'function totalFare(fare, rides) {\n  // Return the total cost\n}\n\nconst cost = totalFare(50, 4);',
          hint: 'Return fare * rides so the function gives back the total.',
          checks: [
            { snippet: 'function totalfare(fare, rides)', hint: 'Create a function named totalFare with fare and rides inputs.' },
            { snippet: 'return fare * rides', hint: 'Return fare multiplied by rides.' },
            { snippet: 'totalfare(50, 4)', hint: 'Try the function with 50 and 4.' },
          ],
          successMessage: 'That function can now work out the total cost of several rides.',
        },
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
        practice: {
          instruction: 'Use PHP to welcome everyone to the science club.',
          starter: '<?php\n  // Write a welcome message\n?>',
          hint: 'Use echo, then put the message inside quotation marks.',
          checks: [
            { snippet: '<?php', hint: 'Start the PHP block with <?php.' },
            { snippet: 'echo', hint: 'Use echo to write text in the response.' },
            { snippet: 'welcome to the science club', hint: 'Include a welcome to the science club.' },
            { snippet: '?>', hint: 'Close the PHP block with ?>.' },
          ],
          successMessage: 'Nice. PHP can now send the club welcome to the page.',
        },
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
        practice: {
          instruction: 'Save a learner’s name and use it in a greeting.',
          starter: '<?php\n  // Create $name and greet the learner\n?>',
          hint: 'Start the variable with $. Join the greeting and name with a dot.',
          checks: [
            { snippet: '$name = "amina"', hint: 'Create a $name variable and give it a name.' },
            { snippet: 'echo', hint: 'Use echo to send the greeting.' },
            { snippet: '.', hint: 'Use a dot to join the greeting text and $name.' },
            { snippet: '$name', hint: 'Use $name in the greeting so it can be personalised.' },
          ],
          successMessage: 'Your greeting can now use the learner’s name.',
        },
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
        practice: {
          instruction: 'Show a personal greeting when a name is given, or a general one otherwise.',
          starter: '<?php\n  // Add an if / else check for $name\n?>',
          hint: 'Check that $name is not an empty string, then add an else message.',
          checks: [
            { snippet: 'if ($name !== "")', hint: 'Check that $name is different from an empty string.' },
            { snippet: 'echo', hint: 'Use echo to show a greeting.' },
            { snippet: 'else', hint: 'Add an else block for when the name is empty.' },
            { snippet: 'hello, learner', hint: 'Give the else block a simple general greeting.' },
          ],
          successMessage: 'The page now has a greeting for both situations.',
        },
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
        practice: {
          instruction: 'Create a members table with an id and a name.',
          starter: '-- Add the members table and its two columns',
          hint: 'Use CREATE TABLE members, then add id and name inside parentheses.',
          checks: [
            { snippet: 'create table members', hint: 'Start with CREATE TABLE members.' },
            { snippet: 'id int primary key', hint: 'Add an id column that is an INT PRIMARY KEY.' },
            { snippet: 'name varchar(80)', hint: 'Add a name column that can hold up to 80 characters.' },
          ],
          successMessage: 'You made a table with a clear place for each member’s details.',
        },
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
        practice: {
          instruction: 'Read the name and club columns from the members table.',
          starter: '-- Write a query for member names and clubs',
          hint: 'Name both columns after SELECT and the table after FROM.',
          checks: [
            { snippet: 'select name, club', hint: 'Select both name and club.' },
            { snippet: 'from members', hint: 'Read those columns FROM members.' },
          ],
          successMessage: 'Your query now asks for exactly the member details you need.',
        },
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
        practice: {
          instruction: 'Find the names of members in the science club.',
          starter: 'SELECT name\nFROM members\n-- Add a filter for the Science club',
          hint: 'Add WHERE club = followed by the club name in single quotes.',
          checks: [
            { snippet: 'select name', hint: 'Ask for the member name with SELECT name.' },
            { snippet: 'from members', hint: 'Read the records FROM members.' },
            { snippet: "where club = 'science'", hint: "Filter with WHERE club = 'Science'." },
          ],
          successMessage: 'Your WHERE clause now keeps only science-club members.',
        },
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
