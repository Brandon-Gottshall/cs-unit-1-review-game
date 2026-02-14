/**
 * CS-1301 Unit 1 Review Game - Unified Question Pool
 * Chapters 1-2: Introduction to Java & Variables & Assignments
 *
 * Question Types:
 * - vocabulary: Java terminology and concepts
 * - true_false: True/False questions
 * - trace_variables: Trace variable values through code
 * - predict_output: Predict output of code snippets
 * - identify_error: Find syntax/logic errors in code
 * - complete_code: Fill in missing code
 * - valid_invalid: Determine if code is syntactically valid
 * - match_definition: Match terms to definitions
 * - code_analysis: Analyze code behavior
 */

export type CSQuestionType =
  | 'vocabulary'
  | 'true_false'
  | 'trace_variables'
  | 'predict_output'
  | 'identify_error'
  | 'complete_code'
  | 'valid_invalid'
  | 'match_definition'
  | 'code_analysis';

export interface VariableTraceData {
  code: string;
  finalValues: Record<string, string | number>;
  steps?: string[];
}

export interface CodeOutputData {
  code: string;
  expectedOutput: string;
}

export interface ErrorData {
  code: string;
  errorType: string;
  errorLine: number;
}

export interface InteractiveData {
  code?: string;
  variantData?: VariableTraceData;
  outputData?: CodeOutputData;
  errorData?: ErrorData;
}

export interface CSUnifiedQuestion {
  id: string;
  chapter: number;
  section?: string;
  type: CSQuestionType;
  question: string;
  correctAnswer: string;
  distractors?: string[];
  explanation?: string;
  keyFacts?: string[];
  formula?: string;
  interactive?: InteractiveData;
}

// ============================================
// CHAPTER 1: INTRODUCTION TO JAVA
// ============================================

// 1.1: Computer Components
const ch1ComputerComponents: CSUnifiedQuestion[] = [
  {
    id: 'ch1-comp-001',
    chapter: 1,
    section: '1.1',
    type: 'vocabulary',
    question: 'What does "JVM" stand for in Java?',
    correctAnswer: 'Java Virtual Machine',
    distractors: ['Java Verification Module', 'Java Validation Manager', 'Java Version Module'],
    explanation: 'The JVM is an abstract computing machine that enables a computer to run Java programs and programs written in other languages that are compiled to Java bytecode.',
    keyFacts: ['JVM allows "write once, run anywhere"', 'JVM converts bytecode to machine code', 'Different JVMs exist for different operating systems'],
  },
  {
    id: 'ch1-comp-002',
    chapter: 1,
    section: '1.1',
    type: 'vocabulary',
    question: 'What is the purpose of a Java compiler?',
    correctAnswer: 'To translate Java source code (.java) into bytecode (.class files)',
    distractors: ['To run Java programs directly', 'To create executable programs', 'To optimize runtime performance'],
    explanation: 'The compiler translates human-readable Java source code into platform-independent bytecode that the JVM can execute.',
  },
  {
    id: 'ch1-comp-003',
    chapter: 1,
    section: '1.1',
    type: 'true_false',
    question: 'Java source code (.java files) can be executed directly by the CPU without compilation.',
    correctAnswer: 'False',
    distractors: ['True'],
    explanation: 'Java source code must be compiled into bytecode first. The JVM then interprets or just-in-time compiles the bytecode for execution.',
  },
  {
    id: 'ch1-comp-004',
    chapter: 1,
    section: '1.1',
    type: 'vocabulary',
    question: 'What is bytecode in Java?',
    correctAnswer: 'Intermediate code produced by the compiler that runs on the JVM',
    distractors: ['Machine code that runs on the CPU', 'Source code before compilation', 'An error message from the compiler'],
    explanation: 'Bytecode is the intermediate representation of a Java program. It is platform-independent and can run on any system with a JVM installed.',
  },
];

// 1.2: Language History
const ch1LanguageHistory: CSUnifiedQuestion[] = [
  {
    id: 'ch1-lang-001',
    chapter: 1,
    section: '1.2',
    type: 'vocabulary',
    question: 'What year was Java first released?',
    correctAnswer: '1995',
    distractors: ['1985', '2000', '1990'],
    explanation: 'Java was first released by Sun Microsystems in 1995. It was designed to be platform-independent and secure.',
  },
  {
    id: 'ch1-lang-002',
    chapter: 1,
    section: '1.2',
    type: 'true_false',
    question: 'Java was designed to replace C++ completely.',
    correctAnswer: 'False',
    distractors: ['True'],
    explanation: 'While Java improved upon C++, it was designed as a new language rather than a complete replacement. Both languages coexist today.',
  },
  {
    id: 'ch1-lang-003',
    chapter: 1,
    section: '1.2',
    type: 'vocabulary',
    question: 'Which company originally created Java?',
    correctAnswer: 'Sun Microsystems',
    distractors: ['Microsoft', 'Apple', 'IBM'],
    explanation: 'Sun Microsystems developed Java in the mid-1990s. Oracle Corporation later acquired Sun Microsystems in 2010.',
  },
  {
    id: 'ch1-lang-004',
    chapter: 1,
    section: '1.2',
    type: 'true_false',
    question: 'Java is derived from programming languages like C and C++.',
    correctAnswer: 'True',
    distractors: ['False'],
    explanation: 'Java borrows syntax and concepts from C and C++ but simplifies some aspects and removes others like manual memory management.',
  },
];

// 1.3: Programs and Instructions
const ch1ProgramsInstructions: CSUnifiedQuestion[] = [
  {
    id: 'ch1-prog-001',
    chapter: 1,
    section: '1.3',
    type: 'vocabulary',
    question: 'What is a program in computer science?',
    correctAnswer: 'A sequence of instructions that tells the computer what to do',
    distractors: ['A data structure', 'A memory location', 'An error message'],
    explanation: 'A program is a set of instructions written in a programming language that a computer executes to accomplish a specific task.',
  },
  {
    id: 'ch1-prog-002',
    chapter: 1,
    section: '1.3',
    type: 'vocabulary',
    question: 'What is an algorithm?',
    correctAnswer: 'A step-by-step procedure for solving a problem',
    distractors: ['A data type', 'A variable name', 'A compiler feature'],
    explanation: 'An algorithm is a finite sequence of well-defined instructions to accomplish a task or solve a problem. It is the logic behind a program.',
  },
  {
    id: 'ch1-prog-003',
    chapter: 1,
    section: '1.3',
    type: 'true_false',
    question: 'In Java, every program must have a main() method to execute.',
    correctAnswer: 'True',
    distractors: ['False'],
    explanation: 'The main() method is the entry point for Java applications. When you run a program, the JVM starts executing from the main() method.',
  },
  {
    id: 'ch1-prog-004',
    chapter: 1,
    section: '1.3',
    type: 'code_analysis',
    question: 'Which statement is true about this Java program structure?',
    formula: 'public class HelloWorld {\n  public static void main(String[] args) {\n    System.out.println("Hello World");\n  }\n}',
    correctAnswer: 'This program will execute and print "Hello World" to the console',
    distractors: ['This program will not compile', 'The class name must be different', 'The main method must be private'],
    explanation: 'This is valid Java program structure with a public class, static main method that accepts String[] args, and proper syntax.',
  },
];

// 1.4: IDE Concepts
const ch1IdeConcepts: CSUnifiedQuestion[] = [
  {
    id: 'ch1-ide-001',
    chapter: 1,
    section: '1.4',
    type: 'vocabulary',
    question: 'What does "IDE" stand for?',
    correctAnswer: 'Integrated Development Environment',
    distractors: ['Internal Data Editor', 'Internet Development Engine', 'Interactive Database Editor'],
    explanation: 'An IDE is a software suite that provides comprehensive facilities for writing, compiling, testing, and debugging code.',
  },
  {
    id: 'ch1-ide-002',
    chapter: 1,
    section: '1.4',
    type: 'vocabulary',
    question: 'What is the primary function of an IDE\'s compiler in the development workflow?',
    correctAnswer: 'To detect syntax errors before runtime',
    distractors: ['To run the program', 'To manage memory', 'To create comments'],
    explanation: 'The IDE\'s compiler checks the code for syntax errors during development, helping you identify and fix mistakes before execution.',
  },
  {
    id: 'ch1-ide-003',
    chapter: 1,
    section: '1.4',
    type: 'true_false',
    question: 'An IDE combines text editing, compilation, and debugging tools in one application.',
    correctAnswer: 'True',
    distractors: ['False'],
    explanation: 'IDEs integrate multiple tools (editor, compiler, debugger, etc.) into a single application to streamline the development process.',
  },
  {
    id: 'ch1-ide-004',
    chapter: 1,
    section: '1.4',
    type: 'vocabulary',
    question: 'Which of the following is a popular Java IDE?',
    correctAnswer: 'IntelliJ IDEA',
    distractors: ['Microsoft Word', 'Notepad', 'Adobe Photoshop'],
    explanation: 'IntelliJ IDEA, Eclipse, and NetBeans are popular IDEs for Java development. Microsoft Word, Notepad, and Adobe Photoshop are not development tools.',
  },
];

// 1.5: Programming Basics
const ch1ProgrammingBasics: CSUnifiedQuestion[] = [
  {
    id: 'ch1-basics-001',
    chapter: 1,
    section: '1.5',
    type: 'vocabulary',
    question: 'What is a statement in Java?',
    correctAnswer: 'A single instruction that performs a specific action',
    distractors: ['A group of variables', 'A data type', 'A comment in code'],
    explanation: 'A statement is a single instruction in Java that tells the computer to do something. All statements end with a semicolon.',
  },
  {
    id: 'ch1-basics-002',
    chapter: 1,
    section: '1.5',
    type: 'true_false',
    question: 'Java is case-sensitive, meaning "System", "system", and "SYSTEM" are different identifiers.',
    correctAnswer: 'True',
    distractors: ['False'],
    explanation: 'Java is case-sensitive. "System" (the class), "system", and "SYSTEM" are all different identifiers.',
  },
  {
    id: 'ch1-basics-003',
    chapter: 1,
    section: '1.5',
    type: 'vocabulary',
    question: 'What does "void" mean in the context of a method signature?',
    correctAnswer: 'The method does not return a value',
    distractors: ['The method has no parameters', 'The method is empty', 'The method is private'],
    explanation: 'The "void" keyword indicates that a method does not return a value. If a method returns a value, a return type must be specified.',
  },
  {
    id: 'ch1-basics-004',
    chapter: 1,
    section: '1.5',
    type: 'code_analysis',
    question: 'What is the output of this code?',
    formula: 'public class Test {\n  public static void main(String[] args) {\n    int x = 10;\n    System.out.println(x);\n  }\n}',
    correctAnswer: '10',
    distractors: ['x', 'int', 'Error: x is not defined'],
    explanation: 'The variable x is declared and assigned the value 10, then printed to the console. The output is: 10',
  },
];

// 1.6: Comments and Whitespace
const ch1CommentsWhitespace: CSUnifiedQuestion[] = [
  {
    id: 'ch1-comments-001',
    chapter: 1,
    section: '1.6',
    type: 'vocabulary',
    question: 'What is the purpose of comments in Java code?',
    correctAnswer: 'To explain code to programmers without affecting program execution',
    distractors: ['To declare variables', 'To store data', 'To execute code'],
    explanation: 'Comments are explanatory notes for humans and are ignored by the compiler. They improve code readability and maintainability.',
  },
  {
    id: 'ch1-comments-002',
    chapter: 1,
    section: '1.6',
    type: 'vocabulary',
    question: 'How is a single-line comment written in Java?',
    correctAnswer: 'Using two forward slashes: //',
    distractors: ['Using a hash: #', 'Using parentheses: ()', 'Using a percent: %'],
    explanation: 'Single-line comments in Java start with // and continue to the end of the line. Everything after // on that line is ignored.',
  },
  {
    id: 'ch1-comments-003',
    chapter: 1,
    section: '1.6',
    type: 'vocabulary',
    question: 'How is a multi-line comment written in Java?',
    correctAnswer: 'Using /* and */ delimiters',
    distractors: ['Using // on each line', 'Using # at the start', 'Using <comment> tags'],
    explanation: 'Multi-line comments in Java are enclosed with /* at the start and */ at the end. Everything between these delimiters is ignored.',
  },
  {
    id: 'ch1-comments-004',
    chapter: 1,
    section: '1.6',
    type: 'true_false',
    question: 'Whitespace (spaces, tabs, newlines) affects the execution of Java programs.',
    correctAnswer: 'False',
    distractors: ['True'],
    explanation: 'Whitespace is ignored by the Java compiler (except within strings). You can format code however you like for readability.',
  },
];

// 1.7: Errors and Debugging
const ch1ErrorsDebugging: CSUnifiedQuestion[] = [
  {
    id: 'ch1-errors-001',
    chapter: 1,
    section: '1.7',
    type: 'vocabulary',
    question: 'What is a syntax error in Java?',
    correctAnswer: 'An error in code that violates the rules of Java language syntax',
    distractors: ['An error that occurs when the program runs', 'A logical mistake in the algorithm', 'A warning message'],
    explanation: 'Syntax errors are violations of the Java grammar rules. The compiler detects them and prevents the program from running until they are fixed.',
  },
  {
    id: 'ch1-errors-002',
    chapter: 1,
    section: '1.7',
    type: 'vocabulary',
    question: 'What is a runtime error?',
    correctAnswer: 'An error that occurs while the program is executing',
    distractors: ['An error detected by the compiler', 'A typo in the code', 'A warning message'],
    explanation: 'Runtime errors occur during program execution and cause the program to crash or behave unexpectedly.',
  },
  {
    id: 'ch1-errors-003',
    chapter: 1,
    section: '1.7',
    type: 'identify_error',
    question: 'What error exists in this code?',
    formula: 'public static void main(String[] args) {\n  int x = 5\n  System.out.println(x);\n}',
    correctAnswer: 'Missing semicolon after x = 5',
    distractors: ['Missing parentheses in main', 'Wrong data type', 'Variable x not declared'],
    explanation: 'Every Java statement must end with a semicolon. Line 2 should be: int x = 5;',
    interactive: {
      errorData: {
        code: 'public static void main(String[] args) {\n  int x = 5\n  System.out.println(x);\n}',
        errorType: 'Syntax Error - Missing semicolon',
        errorLine: 2,
      },
    },
  },
  {
    id: 'ch1-errors-004',
    chapter: 1,
    section: '1.7',
    type: 'vocabulary',
    question: 'What is a logic error?',
    correctAnswer: 'An error where the program runs but produces incorrect results',
    distractors: ['A syntax error caught by the compiler', 'A runtime error that crashes the program', 'A missing semicolon'],
    explanation: 'Logic errors are mistakes in the algorithm or problem-solving approach. The program compiles and runs but gives wrong results.',
  },
];

// ============================================
// CHAPTER 2: VARIABLES AND ASSIGNMENTS
// ============================================

// 2.1-2.4: Variables and Assignments
const ch2VariablesAssignments: CSUnifiedQuestion[] = [
  {
    id: 'ch2-vars-001',
    chapter: 2,
    section: '2.1',
    type: 'vocabulary',
    question: 'What is a variable in Java?',
    correctAnswer: 'A named container that stores a value in memory',
    distractors: ['A type of data', 'A method parameter', 'A constant value'],
    explanation: 'Variables are identifiers that reference memory locations holding values. They have a name, type, and value.',
    keyFacts: ['Variables must be declared before use', 'Variables have a scope where they are accessible', 'Variables are mutable (can change)'],
  },
  {
    id: 'ch2-vars-002',
    chapter: 2,
    section: '2.1',
    type: 'true_false',
    question: 'In Java, you can use a variable before declaring it.',
    correctAnswer: 'False',
    distractors: ['True'],
    explanation: 'Variables must be declared before they are used. This follows the "declaration before use" principle.',
  },
  {
    id: 'ch2-vars-003',
    chapter: 2,
    section: '2.2',
    type: 'vocabulary',
    question: 'What does the equals sign (=) do in Java?',
    correctAnswer: 'It assigns a value to a variable',
    distractors: ['It compares two values', 'It declares a variable', 'It defines a constant'],
    explanation: 'The equals sign is the assignment operator. It takes the value on the right and stores it in the variable on the left.',
  },
  {
    id: 'ch2-vars-004',
    chapter: 2,
    section: '2.2',
    type: 'trace_variables',
    question: 'What are the final values of x and y after this code executes?',
    formula: 'int x = 10;\nint y = x + 5;\nx = 15;',
    correctAnswer: 'x = 15, y = 15',
    distractors: ['x = 15, y = 10', 'x = 10, y = 15', 'x = 25, y = 15'],
    explanation: 'x is initially 10, y becomes 15 (10+5), then x is reassigned to 15. Changing x does not affect y.',
    interactive: {
      variantData: {
        code: 'int x = 10;\nint y = x + 5;\nx = 15;',
        finalValues: { x: 15, y: 15 },
        steps: ['x = 10', 'y = 10 + 5 = 15', 'x = 15'],
      },
    },
  },
  {
    id: 'ch2-vars-005',
    chapter: 2,
    section: '2.3',
    type: 'trace_variables',
    question: 'What is the value of z after this code?',
    formula: 'int a = 5;\nint b = a;\nb = 10;\nint z = a + b;',
    correctAnswer: 'z = 15',
    distractors: ['z = 20', 'z = 10', 'z = 5'],
    explanation: 'a = 5, b gets the value of a (5), then b changes to 10. z = a + b = 5 + 10 = 15. Assigning b = a copies the value, not creates a reference.',
    interactive: {
      variantData: {
        code: 'int a = 5;\nint b = a;\nb = 10;\nint z = a + b;',
        finalValues: { a: 5, b: 10, z: 15 },
        steps: ['a = 5', 'b = 5', 'b = 10', 'z = 5 + 10 = 15'],
      },
    },
  },
  {
    id: 'ch2-vars-006',
    chapter: 2,
    section: '2.4',
    type: 'code_analysis',
    question: 'What happens when you declare multiple variables in one statement?',
    formula: 'int x = 5, y = 10, z = 15;',
    correctAnswer: 'All three variables are declared and initialized in one statement',
    distractors: ['Only x is declared', 'This causes a syntax error', 'Only y and z are declared'],
    explanation: 'You can declare multiple variables of the same type in one statement by separating them with commas.',
  },
];

// 2.2: Identifiers
const ch2Identifiers: CSUnifiedQuestion[] = [
  {
    id: 'ch2-ident-001',
    chapter: 2,
    section: '2.2',
    type: 'vocabulary',
    question: 'What is an identifier in Java?',
    correctAnswer: 'A name given to a variable, method, or class',
    distractors: ['A number or value', 'A data type', 'A reserved keyword'],
    explanation: 'Identifiers are user-defined names for variables, methods, and classes. They must follow Java naming rules.',
  },
  {
    id: 'ch2-ident-002',
    chapter: 2,
    section: '2.2',
    type: 'true_false',
    question: 'Variable names in Java can start with a number.',
    correctAnswer: 'False',
    distractors: ['True'],
    explanation: 'Identifiers must start with a letter, underscore (_), or dollar sign ($). They cannot start with a number.',
  },
  {
    id: 'ch2-ident-003',
    chapter: 2,
    section: '2.2',
    type: 'vocabulary',
    question: 'Which of the following is a valid identifier in Java?',
    correctAnswer: '_myVariable',
    distractors: ['2variable', 'my-variable', 'my variable'],
    explanation: 'Valid identifiers can contain letters, digits, underscores, and dollar signs (but cannot start with a digit or contain hyphens/spaces).',
  },
  {
    id: 'ch2-ident-004',
    chapter: 2,
    section: '2.2',
    type: 'valid_invalid',
    question: 'Is "class" a valid variable name in Java?',
    correctAnswer: 'Invalid - class is a reserved keyword',
    distractors: ['Valid', 'Invalid - wrong format', 'Invalid - too short'],
    explanation: 'Java has reserved keywords like class, int, public, etc. that cannot be used as identifier names.',
  },
];

// 2.5: Arithmetic Operations (Integers)
const ch2ArithmeticInt: CSUnifiedQuestion[] = [
  {
    id: 'ch2-arith-001',
    chapter: 2,
    section: '2.5',
    type: 'vocabulary',
    question: 'What is the result of the expression 10 + 5 * 2 in Java?',
    correctAnswer: '20',
    distractors: ['30', '25', '12'],
    explanation: 'Following order of operations (PEMDAS), multiplication is performed before addition: 10 + (5 * 2) = 10 + 10 = 20.',
  },
  {
    id: 'ch2-arith-002',
    chapter: 2,
    section: '2.5',
    type: 'predict_output',
    question: 'What does this code print?',
    formula: 'int x = 7;\nint y = 3;\nSystem.out.println(x + y);',
    correctAnswer: '10',
    distractors: ['73', '21', '4'],
    explanation: 'The + operator adds the two integers: 7 + 3 = 10.',
    interactive: {
      outputData: {
        code: 'int x = 7;\nint y = 3;\nSystem.out.println(x + y);',
        expectedOutput: '10',
      },
    },
  },
  {
    id: 'ch2-arith-003',
    chapter: 2,
    section: '2.5',
    type: 'predict_output',
    question: 'What is printed?',
    formula: 'int a = 15;\nint b = 4;\nSystem.out.println(a - b);',
    correctAnswer: '11',
    distractors: ['19', '-11', '12'],
    explanation: 'Subtraction: 15 - 4 = 11.',
    interactive: {
      outputData: {
        code: 'int a = 15;\nint b = 4;\nSystem.out.println(a - b);',
        expectedOutput: '11',
      },
    },
  },
  {
    id: 'ch2-arith-004',
    chapter: 2,
    section: '2.5',
    type: 'predict_output',
    question: 'What is the output?',
    formula: 'int x = 6;\nint y = 7;\nSystem.out.println(x * y);',
    correctAnswer: '42',
    distractors: ['67', '13', '36'],
    explanation: 'Multiplication: 6 * 7 = 42.',
    interactive: {
      outputData: {
        code: 'int x = 6;\nint y = 7;\nSystem.out.println(x * y);',
        expectedOutput: '42',
      },
    },
  },
];

// 2.6: Floating-Point Numbers
const ch2FloatingPoint: CSUnifiedQuestion[] = [
  {
    id: 'ch2-float-001',
    chapter: 2,
    section: '2.6',
    type: 'vocabulary',
    question: 'What is the difference between int and double in Java?',
    correctAnswer: 'int stores whole numbers, double stores numbers with decimal places',
    distractors: ['int is faster than double', 'double can only store positive numbers', 'int is larger than double'],
    explanation: 'int is used for whole numbers (integers), while double is used for floating-point numbers (decimals).',
  },
  {
    id: 'ch2-float-002',
    chapter: 2,
    section: '2.6',
    type: 'predict_output',
    question: 'What does this code print?',
    formula: 'double x = 3.5;\ndouble y = 2.5;\nSystem.out.println(x + y);',
    correctAnswer: '6.0',
    distractors: ['6', '6.0.0', '35 25'],
    explanation: 'Adding two double values: 3.5 + 2.5 = 6.0.',
    interactive: {
      outputData: {
        code: 'double x = 3.5;\ndouble y = 2.5;\nSystem.out.println(x + y);',
        expectedOutput: '6.0',
      },
    },
  },
  {
    id: 'ch2-float-003',
    chapter: 2,
    section: '2.6',
    type: 'trace_variables',
    question: 'What is the value of result?',
    formula: 'double price = 19.99;\ndouble tax = 1.50;\ndouble result = price + tax;',
    correctAnswer: 'result = 21.49',
    distractors: ['result = 20.49', 'result = 21.00', 'result = 1.99'],
    explanation: '19.99 + 1.50 = 21.49',
    interactive: {
      variantData: {
        code: 'double price = 19.99;\ndouble tax = 1.50;\ndouble result = price + tax;',
        finalValues: { result: 21.49 },
        steps: ['price = 19.99', 'tax = 1.50', 'result = 19.99 + 1.50 = 21.49'],
      },
    },
  },
  {
    id: 'ch2-float-004',
    chapter: 2,
    section: '2.6',
    type: 'true_false',
    question: 'A double can store larger values than an int.',
    correctAnswer: 'True',
    distractors: ['False'],
    explanation: 'A double can represent much larger values due to its range and can handle both very large and very small numbers.',
  },
];

// 2.7: Integer Division and Modulo
const ch2IntDivisionModulo: CSUnifiedQuestion[] = [
  {
    id: 'ch2-divmod-001',
    chapter: 2,
    section: '2.7',
    type: 'vocabulary',
    question: 'What is integer division in Java?',
    correctAnswer: 'Division that discards the fractional part and returns only the whole number quotient',
    distractors: ['Division that rounds to the nearest integer', 'Division that always uses floating-point', 'Division that returns only the remainder'],
    explanation: 'When dividing two integers, Java discards any remainder. For example, 7 / 2 = 3 (not 3.5).',
  },
  {
    id: 'ch2-divmod-002',
    chapter: 2,
    section: '2.7',
    type: 'predict_output',
    question: 'What is printed?',
    formula: 'int x = 17;\nint y = 5;\nSystem.out.println(x / y);',
    correctAnswer: '3',
    distractors: ['3.4', '5', '4'],
    explanation: 'Integer division: 17 / 5 = 3 (remainder discarded).',
    interactive: {
      outputData: {
        code: 'int x = 17;\nint y = 5;\nSystem.out.println(x / y);',
        expectedOutput: '3',
      },
    },
  },
  {
    id: 'ch2-divmod-003',
    chapter: 2,
    section: '2.7',
    type: 'vocabulary',
    question: 'What is the modulo operator (%) used for?',
    correctAnswer: 'To find the remainder after division',
    distractors: ['To find the quotient', 'To multiply numbers', 'To subtract numbers'],
    explanation: 'The % operator returns the remainder of integer division. For example, 17 % 5 = 2.',
  },
  {
    id: 'ch2-divmod-004',
    chapter: 2,
    section: '2.7',
    type: 'predict_output',
    question: 'What does this code output?',
    formula: 'int a = 20;\nint b = 6;\nSystem.out.println(a % b);',
    correctAnswer: '2',
    distractors: ['3', '6', '20'],
    explanation: 'Modulo operation: 20 % 6 = 2 (remainder when 20 is divided by 6).',
    interactive: {
      outputData: {
        code: 'int a = 20;\nint b = 6;\nSystem.out.println(a % b);',
        expectedOutput: '2',
      },
    },
  },
];

// 2.8: Type Conversions and Casting
const ch2TypeConversions: CSUnifiedQuestion[] = [
  {
    id: 'ch2-cast-001',
    chapter: 2,
    section: '2.8',
    type: 'vocabulary',
    question: 'What is type casting in Java?',
    correctAnswer: 'Converting a value from one data type to another',
    distractors: ['Declaring a new variable', 'Comparing two values', 'Creating a constant'],
    explanation: 'Type casting allows you to convert values between compatible types. It can be implicit (widening) or explicit (narrowing).',
  },
  {
    id: 'ch2-cast-002',
    chapter: 2,
    section: '2.8',
    type: 'valid_invalid',
    question: 'Is this code valid? int x = 5.5;',
    correctAnswer: 'Invalid - double value assigned to int variable',
    distractors: ['Valid', 'Invalid - missing semicolon', 'Invalid - wrong variable name'],
    explanation: 'You cannot directly assign a double to an int. You must cast: int x = (int) 5.5;',
  },
  {
    id: 'ch2-cast-003',
    chapter: 2,
    section: '2.8',
    type: 'predict_output',
    question: 'What is printed?',
    formula: 'int result = (int) 7.8;\nSystem.out.println(result);',
    correctAnswer: '7',
    distractors: ['7.8', '8', '0'],
    explanation: 'Casting 7.8 to int truncates (removes) the decimal part, leaving 7.',
    interactive: {
      outputData: {
        code: 'int result = (int) 7.8;\nSystem.out.println(result);',
        expectedOutput: '7',
      },
    },
  },
  {
    id: 'ch2-cast-004',
    chapter: 2,
    section: '2.8',
    type: 'true_false',
    question: 'You can assign an int value to a double variable without explicit casting.',
    correctAnswer: 'True',
    distractors: ['False'],
    explanation: 'Converting from int to double is implicit (widening conversion) because double can hold all int values safely.',
  },
];

// 2.9: Constants
const ch2Constants: CSUnifiedQuestion[] = [
  {
    id: 'ch2-const-001',
    chapter: 2,
    section: '2.9',
    type: 'vocabulary',
    question: 'What is a constant in Java?',
    correctAnswer: 'A variable whose value cannot be changed after initialization',
    distractors: ['A method that returns a value', 'A variable declared in a method', 'A data type like int or double'],
    explanation: 'Constants are declared with the "final" keyword and maintain the same value throughout the program.',
  },
  {
    id: 'ch2-const-002',
    chapter: 2,
    section: '2.9',
    type: 'vocabulary',
    question: 'How is a constant declared in Java?',
    correctAnswer: 'Using the "final" keyword before the variable declaration',
    distractors: ['Using the "static" keyword', 'Using the "public" keyword', 'Using the "constant" keyword'],
    explanation: 'The "final" keyword prevents modification of a variable after it is initialized: final int MAX = 100;',
  },
  {
    id: 'ch2-const-003',
    chapter: 2,
    section: '2.9',
    type: 'identify_error',
    question: 'What is wrong with this code?',
    formula: 'final int MAX = 100;\nMAX = 200;',
    correctAnswer: 'Cannot assign a value to a final variable',
    distractors: ['Missing semicolon', 'Wrong data type', 'MAX is not declared'],
    explanation: 'Once a final variable is assigned, its value cannot be changed. Attempting to do so causes a compiler error.',
    interactive: {
      errorData: {
        code: 'final int MAX = 100;\nMAX = 200;',
        errorType: 'Cannot assign to final variable',
        errorLine: 2,
      },
    },
  },
  {
    id: 'ch2-const-004',
    chapter: 2,
    section: '2.9',
    type: 'true_false',
    question: 'Constants must be initialized at the time they are declared.',
    correctAnswer: 'True',
    distractors: ['False'],
    explanation: 'Constants declared with "final" must be assigned a value when declared or immediately after (depending on context).',
  },
];

// 2.10: Math Methods
const ch2MathMethods: CSUnifiedQuestion[] = [
  {
    id: 'ch2-math-001',
    chapter: 2,
    section: '2.10',
    type: 'vocabulary',
    question: 'What is Math.sqrt() used for?',
    correctAnswer: 'To calculate the square root of a number',
    distractors: ['To calculate the square of a number', 'To calculate the absolute value', 'To generate a random number'],
    explanation: 'Math.sqrt(x) returns the square root of x. For example, Math.sqrt(16) returns 4.0.',
  },
  {
    id: 'ch2-math-002',
    chapter: 2,
    section: '2.10',
    type: 'predict_output',
    question: 'What does this code print?',
    formula: 'double x = Math.abs(-15.5);\nSystem.out.println(x);',
    correctAnswer: '15.5',
    distractors: ['-15.5', '15', '1'],
    explanation: 'Math.abs() returns the absolute value (magnitude without sign). Math.abs(-15.5) = 15.5.',
    interactive: {
      outputData: {
        code: 'double x = Math.abs(-15.5);\nSystem.out.println(x);',
        expectedOutput: '15.5',
      },
    },
  },
  {
    id: 'ch2-math-003',
    chapter: 2,
    section: '2.10',
    type: 'predict_output',
    question: 'What is the output?',
    formula: 'double result = Math.pow(2, 3);\nSystem.out.println(result);',
    correctAnswer: '8.0',
    distractors: ['6', '5', '2'],
    explanation: 'Math.pow(x, y) calculates x to the power of y. Math.pow(2, 3) = 2^3 = 8.',
    interactive: {
      outputData: {
        code: 'double result = Math.pow(2, 3);\nSystem.out.println(result);',
        expectedOutput: '8.0',
      },
    },
  },
  {
    id: 'ch2-math-004',
    chapter: 2,
    section: '2.10',
    type: 'vocabulary',
    question: 'What does Math.max() do?',
    correctAnswer: 'Returns the larger of two numbers',
    distractors: ['Returns the smaller of two numbers', 'Returns the average of two numbers', 'Returns the product of two numbers'],
    explanation: 'Math.max(a, b) returns the larger value. Math.max(10, 20) returns 20.',
  },
];

// 2.11: Binary Numbers
const ch2Binary: CSUnifiedQuestion[] = [
  {
    id: 'ch2-binary-001',
    chapter: 2,
    section: '2.11',
    type: 'vocabulary',
    question: 'What is binary?',
    correctAnswer: 'A number system using only two digits: 0 and 1',
    distractors: ['A number system using 10 digits', 'A number system using 16 digits', 'A type of Java variable'],
    explanation: 'Binary is base-2. Computers use binary to represent all data internally.',
  },
  {
    id: 'ch2-binary-002',
    chapter: 2,
    section: '2.11',
    type: 'vocabulary',
    question: 'What is the binary representation of 5?',
    correctAnswer: '101',
    distractors: ['001', '110', '111'],
    explanation: '5 in binary = 1*4 + 0*2 + 1*1 = 4 + 0 + 1 = 5. Binary 101 = 5 in decimal.',
  },
  {
    id: 'ch2-binary-003',
    chapter: 2,
    section: '2.11',
    type: 'vocabulary',
    question: 'What decimal value does binary 1011 represent?',
    correctAnswer: '11',
    distractors: ['10', '12', '8'],
    explanation: 'Binary 1011 = 1*8 + 0*4 + 1*2 + 1*1 = 8 + 0 + 2 + 1 = 11.',
  },
  {
    id: 'ch2-binary-004',
    chapter: 2,
    section: '2.11',
    type: 'true_false',
    question: 'A byte in Java can represent values from 0 to 255.',
    correctAnswer: 'True',
    distractors: ['False'],
    explanation: 'A byte is 8 bits, representing 2^8 = 256 possible values (0 to 255 for unsigned).',
  },
];

// 2.12: Characters and Strings
const ch2CharsStrings: CSUnifiedQuestion[] = [
  {
    id: 'ch2-chars-001',
    chapter: 2,
    section: '2.12',
    type: 'vocabulary',
    question: 'What is the difference between char and String in Java?',
    correctAnswer: 'char stores a single character, String stores multiple characters',
    distractors: ['They are the same thing', 'String is smaller than char', 'char is immutable but String is mutable'],
    explanation: 'char is a primitive type for a single character (e.g., \'A\'). String is a reference type for text (e.g., "Hello").',
  },
  {
    id: 'ch2-chars-002',
    chapter: 2,
    section: '2.12',
    type: 'true_false',
    question: 'String literals in Java are enclosed in single quotes.',
    correctAnswer: 'False',
    distractors: ['True'],
    explanation: 'String literals use double quotes ("hello"). Single quotes are for char literals (\'a\').',
  },
  {
    id: 'ch2-chars-003',
    chapter: 2,
    section: '2.12',
    type: 'predict_output',
    question: 'What is printed?',
    formula: 'String greeting = "Hello";\nString name = "Alice";\nSystem.out.println(greeting + " " + name);',
    correctAnswer: 'Hello Alice',
    distractors: ['Hello Alice greetingname', 'HelloAlice', 'greeting name'],
    explanation: 'String concatenation with + joins the strings together.',
    interactive: {
      outputData: {
        code: 'String greeting = "Hello";\nString name = "Alice";\nSystem.out.println(greeting + " " + name);',
        expectedOutput: 'Hello Alice',
      },
    },
  },
  {
    id: 'ch2-chars-004',
    chapter: 2,
    section: '2.12',
    type: 'code_analysis',
    question: 'What is the type of the variable message?',
    formula: 'String message = "Welcome to Java";',
    correctAnswer: 'String',
    distractors: ['char', 'int', 'double'],
    explanation: 'The variable message is of type String because it is initialized with a string literal.',
  },
];

// 2.13: Numeric Types
const ch2NumericTypes: CSUnifiedQuestion[] = [
  {
    id: 'ch2-numtype-001',
    chapter: 2,
    section: '2.13',
    type: 'vocabulary',
    question: 'How many numeric types are there in Java?',
    correctAnswer: '8 (byte, short, int, long, float, double, and others)',
    distractors: ['2 (int and double)', '4 (int, float, double, long)', '5 (byte, short, int, long, float)'],
    explanation: 'Java has 8 primitive numeric types: byte, short, int, long, float, and double.',
  },
  {
    id: 'ch2-numtype-002',
    chapter: 2,
    section: '2.13',
    type: 'vocabulary',
    question: 'Which numeric type has the largest range?',
    correctAnswer: 'double',
    distractors: ['float', 'long', 'int'],
    explanation: 'double is a 64-bit floating-point type that can represent the widest range of values.',
  },
  {
    id: 'ch2-numtype-003',
    chapter: 2,
    section: '2.13',
    type: 'true_false',
    question: 'The long type is used for integer values larger than int can hold.',
    correctAnswer: 'True',
    distractors: ['False'],
    explanation: 'long is a 64-bit integer type, providing a larger range than int (32-bit).',
  },
  {
    id: 'ch2-numtype-004',
    chapter: 2,
    section: '2.13',
    type: 'vocabulary',
    question: 'Which type should you use for simple whole number values like ages or counts?',
    correctAnswer: 'int',
    distractors: ['double', 'float', 'long'],
    explanation: 'int is the standard choice for whole numbers in a typical range. It is efficient and widely used.',
  },
];

// 2.14: Overflow
const ch2Overflow: CSUnifiedQuestion[] = [
  {
    id: 'ch2-overflow-001',
    chapter: 2,
    section: '2.14',
    type: 'vocabulary',
    question: 'What is integer overflow?',
    correctAnswer: 'When a value exceeds the maximum value that a numeric type can store',
    distractors: ['When a program uses too much memory', 'When a variable is not initialized', 'When a string is too long'],
    explanation: 'Integer overflow occurs when an arithmetic operation produces a result larger than the type can represent.',
  },
  {
    id: 'ch2-overflow-002',
    chapter: 2,
    section: '2.14',
    type: 'true_false',
    question: 'If an int variable overflows, Java throws an exception.',
    correctAnswer: 'False',
    distractors: ['True'],
    explanation: 'Java does not throw an exception on integer overflow. Instead, the value wraps around to the minimum value.',
  },
  {
    id: 'ch2-overflow-003',
    chapter: 2,
    section: '2.14',
    type: 'vocabulary',
    question: 'How do you prevent integer overflow?',
    correctAnswer: 'Use a larger numeric type (like long) for values that might exceed int range',
    distractors: ['Use a smaller numeric type', 'Use string concatenation', 'Use the Math.abs() method'],
    explanation: 'To prevent overflow, choose a numeric type with a larger range, such as long instead of int.',
  },
  {
    id: 'ch2-overflow-004',
    chapter: 2,
    section: '2.14',
    type: 'code_analysis',
    question: 'What could be a problem with this code?',
    formula: 'int x = Integer.MAX_VALUE;\nx = x + 1;',
    correctAnswer: 'Integer overflow occurs',
    distractors: ['Missing semicolon', 'x is not initialized', 'Integer.MAX_VALUE is undefined'],
    explanation: 'Adding 1 to the maximum int value causes overflow, wrapping to Integer.MIN_VALUE.',
  },
];

// 2.15: Random Numbers
const ch2RandomNumbers: CSUnifiedQuestion[] = [
  {
    id: 'ch2-random-001',
    chapter: 2,
    section: '2.15',
    type: 'vocabulary',
    question: 'What class is used to generate random numbers in Java?',
    correctAnswer: 'Random',
    distractors: ['Math', 'System', 'Scanner'],
    explanation: 'The java.util.Random class is used to generate pseudo-random numbers in Java.',
  },
  {
    id: 'ch2-random-002',
    chapter: 2,
    section: '2.15',
    type: 'vocabulary',
    question: 'What does the Math.random() method return?',
    correctAnswer: 'A random double between 0.0 (inclusive) and 1.0 (exclusive)',
    distractors: ['A random integer between 0 and 100', 'A random boolean', 'A random String'],
    explanation: 'Math.random() returns a double in the range [0.0, 1.0).',
  },
  {
    id: 'ch2-random-003',
    chapter: 2,
    section: '2.15',
    type: 'code_analysis',
    question: 'How would you generate a random integer between 1 and 10 (inclusive)?',
    formula: 'int randomNum = (int) (Math.random() * 10) + 1;',
    correctAnswer: 'Multiply Math.random() by the range, cast to int, and add 1',
    distractors: ['Use Math.randomInt(1, 10)', 'Use Random.nextInt()', 'Use Math.random() directly'],
    explanation: 'Math.random() * 10 gives 0.0 to 9.999..., cast to int gives 0-9, then add 1 for 1-10.',
  },
  {
    id: 'ch2-random-004',
    chapter: 2,
    section: '2.15',
    type: 'true_false',
    question: 'Math.random() produces truly random numbers.',
    correctAnswer: 'False',
    distractors: ['True'],
    explanation: 'Math.random() produces pseudo-random numbers using a seed. The same seed produces the same sequence.',
  },
];

// ============================================
// UNIFIED QUESTION POOL EXPORT
// ============================================

export const unifiedQuestionPool: CSUnifiedQuestion[] = [
  ...ch1ComputerComponents,
  ...ch1LanguageHistory,
  ...ch1ProgramsInstructions,
  ...ch1IdeConcepts,
  ...ch1ProgrammingBasics,
  ...ch1CommentsWhitespace,
  ...ch1ErrorsDebugging,
  ...ch2VariablesAssignments,
  ...ch2Identifiers,
  ...ch2ArithmeticInt,
  ...ch2FloatingPoint,
  ...ch2IntDivisionModulo,
  ...ch2TypeConversions,
  ...ch2Constants,
  ...ch2MathMethods,
  ...ch2Binary,
  ...ch2CharsStrings,
  ...ch2NumericTypes,
  ...ch2Overflow,
  ...ch2RandomNumbers,
];

export function shuffleArray<T>(arr: T[]): T[] {
  const newArr = [...arr];
  for (let i = newArr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [newArr[i], newArr[j]] = [newArr[j], newArr[i]];
  }
  return newArr;
}
