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
  | 'code_analysis'
  | 'write_program';

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

export interface ProgramData {
  filename: string;          // e.g., "HelloWorld.java"
  description: string;       // problem statement
  expectedOutput: string;    // what correct code should print
  sampleSolution: string;    // reference solution to show after submission
  requiredElements?: string[]; // structural checks, e.g. ["public class", "public static void main"]
  hints?: string[];           // progressive hints
}

export interface InteractiveData {
  code?: string;
  variantData?: VariableTraceData;
  outputData?: CodeOutputData;
  errorData?: ErrorData;
  programData?: ProgramData;
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
    distractors: ['A tool that translates code into machine language', 'A graphical interface for interacting with the computer', 'A single instruction that the CPU executes directly'],
    explanation: 'A program is a set of instructions written in a programming language that a computer executes to accomplish a specific task.',
  },
  {
    id: 'ch1-prog-002',
    chapter: 1,
    section: '1.3',
    type: 'vocabulary',
    question: 'What is an algorithm?',
    correctAnswer: 'A step-by-step procedure for solving a problem',
    distractors: ['A programming language used to write software', 'A tool that checks code for syntax errors', 'A specific method that runs when a program starts'],
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
    question: 'What is the purpose of String[] args in this program\'s main method?',
    formula: 'public class HelloWorld {\n  public static void main(String[] args) {\n    System.out.println("Hello World");\n  }\n}',
    correctAnswer: 'It allows the program to accept command-line arguments',
    distractors: ['It stores the text that gets printed to the console', 'It defines the return type of the main method', 'It specifies which class the program belongs to'],
    explanation: 'The String[] args parameter allows the program to receive command-line arguments when executed. Even if not used, it must be present in the main method signature.',
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
    question: 'A text editor like Notepad is considered an IDE because it can open .java files.',
    correctAnswer: 'False',
    distractors: ['True'],
    explanation: 'A text editor alone is not an IDE. An IDE integrates multiple tools — editor, compiler, debugger — into one application.',
  },
  {
    id: 'ch1-ide-004',
    chapter: 1,
    section: '1.4',
    type: 'vocabulary',
    question: 'Which of the following is a popular Java IDE?',
    correctAnswer: 'IntelliJ IDEA',
    distractors: ['Visual Studio (without extensions)', 'Android SDK Manager', 'Git Bash'],
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
    question: 'In Java, the variables myAge, MyAge, and myage all refer to the same variable.',
    correctAnswer: 'False',
    distractors: ['True'],
    explanation: 'Java is case-sensitive. myAge, MyAge, and myage are three distinct identifiers.',
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
    formula: 'public class Test {\n  public static void main(String[] args) {\n    int x = 10;\n    int y = x;\n    x = 20;\n    System.out.println(y);\n  }\n}',
    correctAnswer: '10',
    distractors: ['20', '30', 'Error: y is undefined'],
    explanation: 'When y = x executes, the value 10 is copied to y. Changing x afterward does not affect y. Output: 10',
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
    distractors: ['To prevent certain lines of code from being compiled permanently', 'To provide instructions that the JVM executes at runtime', 'To define the data types of variables in the program'],
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
    question: 'Which of the following is an example of a syntax error?',
    correctAnswer: 'Writing System.out.Println instead of System.out.println',
    distractors: ['Using the wrong formula to calculate an average', 'Dividing a number by zero during program execution', 'Printing the wrong variable to the console'],
    explanation: 'Syntax errors violate Java grammar rules. System.out.Println (capital P) does not exist — the correct method is println (lowercase p).',
  },
  {
    id: 'ch1-errors-002',
    chapter: 1,
    section: '1.7',
    type: 'vocabulary',
    question: 'Which of the following would cause a runtime error?',
    correctAnswer: 'Attempting to divide an integer by zero',
    distractors: ['Forgetting a semicolon at the end of a statement', 'Using the wrong variable in a calculation', 'Misspelling the keyword "public" as "pubic"'],
    explanation: 'Runtime errors occur during program execution. Division by zero compiles successfully but crashes when executed.',
  },
  {
    id: 'ch1-errors-003',
    chapter: 1,
    section: '1.7',
    type: 'identify_error',
    question: 'What error exists in this code?',
    formula: 'public static void main(String[] args) {\n  int x = 10;\n  int y = 0;\n  System.out.println(x / y);\n}',
    correctAnswer: 'Runtime error — division by zero',
    distractors: ['Syntax error — missing semicolon', 'Logic error — wrong operator used', 'Syntax error — y cannot be assigned 0'],
    explanation: 'This code compiles successfully but crashes during execution because dividing by zero is undefined.',
    interactive: {
      errorData: {
        code: 'public static void main(String[] args) {\n  int x = 10;\n  int y = 0;\n  System.out.println(x / y);\n}',
        errorType: 'Runtime Error - ArithmeticException: / by zero',
        errorLine: 4,
      },
    },
  },
  {
    id: 'ch1-errors-004',
    chapter: 1,
    section: '1.7',
    type: 'vocabulary',
    question: 'A student writes a program to calculate the average of three numbers but uses addition instead of division. What type of error is this?',
    correctAnswer: 'Logic error — the program runs but produces wrong results',
    distractors: ['Syntax error — the compiler will catch it', 'Runtime error — the program will crash', 'Compilation error — the code is invalid Java'],
    explanation: 'Logic errors are mistakes in the algorithm. The code is syntactically correct and runs without crashing, but the output is incorrect because the logic is flawed.',
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
    question: 'What is wrong with this variable declaration?',
    formula: 'int x = 5, double y = 10.0;',
    correctAnswer: 'You cannot declare variables of different types in one statement',
    distractors: ['The variable names are too short', 'You must initialize all variables to the same value', 'The semicolon should be replaced with a colon'],
    explanation: 'When declaring multiple variables in one statement, they must all be of the same type. Use separate statements for different types.',
  },
];

// 2.2: Identifiers
const ch2Identifiers: CSUnifiedQuestion[] = [
  {
    id: 'ch2-ident-001',
    chapter: 2,
    section: '2.2',
    type: 'vocabulary',
    question: 'Which of the following is NOT a valid Java identifier?',
    correctAnswer: '3rdPlace',
    distractors: ['_score', '$total', 'playerName'],
    explanation: 'Identifiers cannot start with a digit. They must begin with a letter, underscore (_), or dollar sign ($).',
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
    question: 'Which of the following is NOT a valid Java identifier?',
    correctAnswer: 'first-name',
    distractors: ['firstName', '_first_name', '$firstName'],
    explanation: 'Identifiers cannot contain hyphens. Valid identifiers use letters, digits, underscores, and dollar signs only.',
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
    formula: 'int x = 2 + 3 * 4;\nSystem.out.println(x);',
    correctAnswer: '14',
    distractors: ['20', '24', '9'],
    explanation: 'Following order of operations (PEMDAS), multiplication is performed before addition: 2 + (3 * 4) = 2 + 12 = 14.',
    interactive: {
      outputData: {
        code: 'int x = 2 + 3 * 4;\nSystem.out.println(x);',
        expectedOutput: '14',
      },
    },
  },
  {
    id: 'ch2-arith-003',
    chapter: 2,
    section: '2.5',
    type: 'predict_output',
    question: 'What is printed?',
    formula: 'int a = 20;\nint b = 10 - 3 * 2;\nSystem.out.println(b);',
    correctAnswer: '4',
    distractors: ['14', '7', '8'],
    explanation: 'Following order of operations: 10 - (3 * 2) = 10 - 6 = 4.',
    interactive: {
      outputData: {
        code: 'int a = 20;\nint b = 10 - 3 * 2;\nSystem.out.println(b);',
        expectedOutput: '4',
      },
    },
  },
  {
    id: 'ch2-arith-004',
    chapter: 2,
    section: '2.5',
    type: 'predict_output',
    question: 'What is the output?',
    formula: 'int x = 10;\nx = x + 3;\nx = x * 2;\nSystem.out.println(x);',
    correctAnswer: '26',
    distractors: ['16', '23', '36'],
    explanation: 'First: x = 10 + 3 = 13. Then: x = 13 * 2 = 26.',
    interactive: {
      outputData: {
        code: 'int x = 10;\nx = x + 3;\nx = x * 2;\nSystem.out.println(x);',
        expectedOutput: '26',
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
    formula: 'int a = 7;\ndouble b = 2.0;\nSystem.out.println(a / b);',
    correctAnswer: '3.5',
    distractors: ['3', '3.0', '4.0'],
    explanation: 'When dividing an int by a double, the result is a double: 7 / 2.0 = 3.5 (not integer division).',
    interactive: {
      outputData: {
        code: 'int a = 7;\ndouble b = 2.0;\nSystem.out.println(a / b);',
        expectedOutput: '3.5',
      },
    },
  },
  {
    id: 'ch2-float-003',
    chapter: 2,
    section: '2.6',
    type: 'trace_variables',
    question: 'What is the value of result?',
    formula: 'int items = 3;\ndouble price = 4.50;\ndouble result = items * price;',
    correctAnswer: 'result = 13.5',
    distractors: ['result = 13', 'result = 12.0', 'Error: cannot multiply int and double'],
    explanation: 'When multiplying int and double, the int is promoted to double: 3 * 4.50 = 13.5',
    interactive: {
      variantData: {
        code: 'int items = 3;\ndouble price = 4.50;\ndouble result = items * price;',
        finalValues: { result: 13.5 },
        steps: ['items = 3', 'price = 4.50', 'result = 3 * 4.50 = 13.5'],
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
    question: 'When does integer division (truncation) occur in Java?',
    correctAnswer: 'When both operands of the division are int types',
    distractors: ['Whenever the / operator is used', 'When the result is stored in an int variable', 'When Math.floor() is applied to the result'],
    explanation: 'Integer division only occurs when both operands are integers. If either operand is a double, floating-point division is performed.',
  },
  {
    id: 'ch2-divmod-002',
    chapter: 2,
    section: '2.7',
    type: 'predict_output',
    question: 'What is printed?',
    formula: 'int result = 1 / 2;\nSystem.out.println(result);',
    correctAnswer: '0',
    distractors: ['0.5', '1', '0.0'],
    explanation: 'Integer division: 1 / 2 = 0 (the fractional part is discarded, not rounded).',
    interactive: {
      outputData: {
        code: 'int result = 1 / 2;\nSystem.out.println(result);',
        expectedOutput: '0',
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
    formula: 'int x = 25;\nint y = 7;\nSystem.out.println(x / y + " r " + x % y);',
    correctAnswer: '3 r 4',
    distractors: ['3.57 r 4', '4 r 3', '3 r 3'],
    explanation: 'Integer division: 25 / 7 = 3. Modulo: 25 % 7 = 4. Result: "3 r 4".',
    interactive: {
      outputData: {
        code: 'int x = 25;\nint y = 7;\nSystem.out.println(x / y + " r " + x % y);',
        expectedOutput: '3 r 4',
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
    question: 'In which situation is an explicit cast required in Java?',
    correctAnswer: 'Assigning a double value to an int variable',
    distractors: ['Assigning an int value to a double variable', 'Assigning an int literal to an int variable', 'Printing a double value with System.out.println'],
    explanation: 'Type casting allows you to convert values between compatible types. It can be implicit (widening) or explicit (narrowing).',
  },
  {
    id: 'ch2-cast-002',
    chapter: 2,
    section: '2.8',
    type: 'valid_invalid',
    question: 'Which of the following assignments will cause a compilation error?',
    correctAnswer: 'int result = 3.0 / 1;',
    distractors: ['double result = 10 / 3;', 'int result = (int) 9.7;', 'double result = 5;'],
    explanation: 'You cannot directly assign a double to an int. You must cast: int x = (int) 5.5;',
  },
  {
    id: 'ch2-cast-003',
    chapter: 2,
    section: '2.8',
    type: 'predict_output',
    question: 'What is printed?',
    formula: 'double x = 9.99;\nint y = (int) x;\nSystem.out.println(y);',
    correctAnswer: '9',
    distractors: ['10', '9.99', '9.0'],
    explanation: 'Casting 9.99 to int truncates (removes) the decimal part, leaving 9.',
    interactive: {
      outputData: {
        code: 'double x = 9.99;\nint y = (int) x;\nSystem.out.println(y);',
        expectedOutput: '9',
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
    question: 'What is the benefit of declaring a variable as final in Java?',
    correctAnswer: 'It prevents the variable from being accidentally reassigned later in the code',
    distractors: ['It makes the variable accessible from any class', 'It allows the variable to store larger values', 'It improves the program\'s execution speed significantly'],
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
    formula: 'final double TAX_RATE = 0.08;\ndouble price = 100.0;\nTAX_RATE = price * 0.10;',
    correctAnswer: 'TAX_RATE was declared as final and cannot be reassigned',
    distractors: ['TAX_RATE must be declared as int, not double', 'The calculation price * 0.10 is invalid', 'Variables in ALL_CAPS cannot store decimal values'],
    explanation: 'Once a final variable is assigned, its value cannot be changed. Attempting to do so causes a compiler error.',
    interactive: {
      errorData: {
        code: 'final double TAX_RATE = 0.08;\ndouble price = 100.0;\nTAX_RATE = price * 0.10;',
        errorType: 'Cannot assign to final variable',
        errorLine: 3,
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
    question: 'What is the return type of Math.sqrt()?',
    correctAnswer: 'double',
    distractors: ['int', 'float', 'long'],
    explanation: 'Math.sqrt(x) returns the square root of x as a double. For example, Math.sqrt(16) returns 4.0.',
  },
  {
    id: 'ch2-math-002',
    chapter: 2,
    section: '2.10',
    type: 'predict_output',
    question: 'What does this code print?',
    formula: 'int a = -3;\nint b = -7;\nSystem.out.println(Math.abs(a + b));',
    correctAnswer: '10',
    distractors: ['-10', '4', '-4'],
    explanation: 'Math.abs() returns the absolute value (magnitude without sign). Math.abs(-3 + -7) = Math.abs(-10) = 10.',
    interactive: {
      outputData: {
        code: 'int a = -3;\nint b = -7;\nSystem.out.println(Math.abs(a + b));',
        expectedOutput: '10',
      },
    },
  },
  {
    id: 'ch2-math-003',
    chapter: 2,
    section: '2.10',
    type: 'predict_output',
    question: 'What is the output?',
    formula: 'double result = Math.pow(3, 3) + Math.pow(2, 4);\nSystem.out.println(result);',
    correctAnswer: '43.0',
    distractors: ['27.0', '12.0', '43'],
    explanation: 'Math.pow(x, y) calculates x to the power of y. Math.pow(3, 3) + Math.pow(2, 4) = 27 + 16 = 43.0.',
    interactive: {
      outputData: {
        code: 'double result = Math.pow(3, 3) + Math.pow(2, 4);\nSystem.out.println(result);',
        expectedOutput: '43.0',
      },
    },
  },
  {
    id: 'ch2-math-004',
    chapter: 2,
    section: '2.10',
    type: 'vocabulary',
    question: 'What does Math.min(Math.max(3, 7), 5) return?',
    correctAnswer: '5',
    distractors: ['3', '7', '15'],
    explanation: 'Math.max(3, 7) returns 7, then Math.min(7, 5) returns 5.',
  },
];

// 2.11: Binary Numbers
const ch2Binary: CSUnifiedQuestion[] = [
  {
    id: 'ch2-binary-001',
    chapter: 2,
    section: '2.11',
    type: 'vocabulary',
    question: 'Why do computers use binary (base-2) instead of decimal (base-10)?',
    correctAnswer: 'Because electronic circuits have two states: on (1) and off (0)',
    distractors: ['Because binary numbers are smaller than decimal numbers', 'Because binary calculations are more accurate than decimal', 'Because Java was designed to only use binary'],
    explanation: 'Binary is base-2. Computers use binary because digital circuits can easily represent two states (on/off, high voltage/low voltage), making binary the natural choice for representing data electronically.',
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
    question: 'Which of the following is a correctly declared char variable?',
    correctAnswer: 'char letter = \'A\';',
    distractors: ['char letter = "A";', 'char letter = \'AB\';', 'String letter = \'A\';'],
    explanation: 'char uses single quotes for a single character (e.g., \'A\'). Double quotes are for String. A char cannot hold multiple characters.',
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
    formula: 'int age = 21;\nString message = "Age: " + age + 1;\nSystem.out.println(message);',
    correctAnswer: 'Age: 211',
    distractors: ['Age: 22', 'Age: 21 1', 'Error: cannot add int to String'],
    explanation: 'String concatenation happens left to right. "Age: " + 21 creates "Age: 21", then + 1 concatenates "1" as a string, resulting in "Age: 211".',
    interactive: {
      outputData: {
        code: 'int age = 21;\nString message = "Age: " + age + 1;\nSystem.out.println(message);',
        expectedOutput: 'Age: 211',
      },
    },
  },
  {
    id: 'ch2-chars-004',
    chapter: 2,
    section: '2.12',
    type: 'code_analysis',
    question: 'What is the result of "Hello".length() in Java?',
    formula: 'System.out.println("Hello".length());',
    correctAnswer: '5',
    distractors: ['4', '6', 'Error: Strings do not have a length method'],
    explanation: 'The .length() method returns the number of characters in a String. "Hello" has 5 characters.',
  },
  {
    id: 'ch2-output-001',
    chapter: 2,
    section: '2.12',
    type: 'predict_output',
    question: 'What does this code print? (use separate lines if needed)',
    formula: 'System.out.println("Hello");\nSystem.out.println("World");',
    correctAnswer: 'Hello\nWorld',
    distractors: ['HelloWorld', 'Hello World', 'Hello\\nWorld'],
    explanation: 'Each println() prints its argument and then moves to a new line. So "Hello" and "World" appear on separate lines.',
    interactive: {
      outputData: {
        code: 'System.out.println("Hello");\nSystem.out.println("World");',
        expectedOutput: 'Hello\nWorld',
      },
    },
  },
  {
    id: 'ch2-output-002',
    chapter: 2,
    section: '2.12',
    type: 'predict_output',
    question: 'What does this code print? (use separate lines if needed)',
    formula: 'System.out.print("Hello");\nSystem.out.println("World");',
    correctAnswer: 'HelloWorld',
    distractors: ['Hello World', 'Hello\\nWorld', 'Hello\nWorld'],
    explanation: 'print() does NOT add a newline, so "World" appears on the same line right after "Hello". println() adds a newline after "World".',
    interactive: {
      outputData: {
        code: 'System.out.print("Hello");\nSystem.out.println("World");',
        expectedOutput: 'HelloWorld',
      },
    },
  },
  {
    id: 'ch2-output-003',
    chapter: 2,
    section: '2.12',
    type: 'predict_output',
    question: 'What does this code print? (use separate lines if needed)',
    formula: 'System.out.print("A");\nSystem.out.print("B");\nSystem.out.println("C");\nSystem.out.println("D");',
    correctAnswer: 'ABC\nD',
    distractors: ['ABCD', 'A\nB\nC\nD', 'A B C\nD'],
    explanation: 'print() keeps output on the same line. The first println() prints "C" and adds a newline. Then "D" appears on the next line.',
    interactive: {
      outputData: {
        code: 'System.out.print("A");\nSystem.out.print("B");\nSystem.out.println("C");\nSystem.out.println("D");',
        expectedOutput: 'ABC\nD',
      },
    },
  },
  {
    id: 'ch2-output-004',
    chapter: 2,
    section: '2.12',
    type: 'predict_output',
    question: 'What does this code print? (use separate lines if needed)',
    formula: 'int x = 5;\nint y = 10;\nSystem.out.println(x);\nSystem.out.println(y);\nSystem.out.println(x + y);',
    correctAnswer: '5\n10\n15',
    distractors: ['5 10 15', '51015', '5\n10\n510'],
    explanation: 'Each println() outputs its value on a separate line. The third call prints x + y = 15 (addition, not concatenation, since both are int).',
    interactive: {
      outputData: {
        code: 'int x = 5;\nint y = 10;\nSystem.out.println(x);\nSystem.out.println(y);\nSystem.out.println(x + y);',
        expectedOutput: '5\n10\n15',
      },
    },
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
    question: 'A long literal in Java must end with the letter L (e.g., 100L).',
    correctAnswer: 'True',
    distractors: ['False'],
    explanation: 'To specify a long literal in Java, you must append L or l to the number (e.g., 100L). Without the L suffix, the compiler treats the number as an int, which can cause compilation errors if the value exceeds int range.',
  },
  {
    id: 'ch2-numtype-004',
    chapter: 2,
    section: '2.13',
    type: 'vocabulary',
    question: 'A student needs to store the population of Earth (approximately 8 billion). Which type should they use?',
    correctAnswer: 'long',
    distractors: ['int', 'double', 'byte'],
    explanation: 'The maximum value for int is approximately 2.1 billion, which is too small for Earth\'s population (8 billion). You must use long, which can hold values up to about 9 quintillion.',
  },
];

// 2.14: Overflow
const ch2Overflow: CSUnifiedQuestion[] = [
  {
    id: 'ch2-overflow-001',
    chapter: 2,
    section: '2.14',
    type: 'vocabulary',
    question: 'What value does an int variable hold after integer overflow occurs?',
    correctAnswer: 'It wraps around to a negative number (the minimum int value)',
    distractors: ['It stays at the maximum integer value', 'It becomes zero', 'The program throws an error and stops'],
    explanation: 'When an int overflows past its maximum value (2,147,483,647), it wraps around to the minimum value (-2,147,483,648). Java does not throw an exception for integer overflow.',
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
    distractors: ['Add a try-catch block to handle the overflow exception', 'Use the Math.max() method to cap the value', 'Declare the variable as final to prevent value changes'],
    explanation: 'To prevent overflow, choose a numeric type with a larger range, such as long instead of int.',
  },
  {
    id: 'ch2-overflow-004',
    chapter: 2,
    section: '2.14',
    type: 'code_analysis',
    question: 'What could be a problem with this code?',
    formula: 'int bigNum = 2000000000;\nint result = bigNum + bigNum;',
    correctAnswer: 'Integer overflow — the sum exceeds int\'s maximum value',
    distractors: ['The variable names are invalid', 'You cannot add two int variables together', 'The result will be stored as a double automatically'],
    explanation: '2,000,000,000 + 2,000,000,000 = 4,000,000,000, which exceeds int\'s maximum value (2,147,483,647). This causes overflow, wrapping to a large negative number.',
  },
];

// 2.15: Random Numbers
const ch2RandomNumbers: CSUnifiedQuestion[] = [
  {
    id: 'ch2-random-001',
    chapter: 2,
    section: '2.15',
    type: 'vocabulary',
    question: 'Which import statement is needed to use the Random class?',
    correctAnswer: 'import java.util.Random;',
    distractors: ['import java.math.Random;', 'import java.lang.Random;', 'No import is needed — Random is in java.lang'],
    explanation: 'The Random class is in the java.util package, so you must import it with: import java.util.Random;',
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
    question: 'What range of values can this expression produce?',
    formula: 'int num = (int) (Math.random() * 6) + 1;',
    correctAnswer: '1 to 6 (inclusive)',
    distractors: ['0 to 6 (inclusive)', '1 to 7 (inclusive)', '0 to 5 (inclusive)'],
    explanation: 'Math.random() * 6 gives 0.0 to 5.999..., cast to int gives 0-5, then add 1 to shift the range to 1-6 (like a dice roll).',
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

// ============================================
// WRITE PROGRAM CHALLENGES
// ============================================
const writeProgramChallenges: CSUnifiedQuestion[] = [
  {
    id: 'wp-001',
    chapter: 1,
    section: '1.5',
    type: 'write_program',
    question: 'Write a complete Java program in HelloWorld.java that prints "Hello, World!" to the console.',
    correctAnswer: 'A complete HelloWorld.java program that prints "Hello, World!"',
    explanation: 'Every Java program needs a class whose name matches the filename, and a main method as the entry point.',
    keyFacts: [
      'Class name must match filename (without .java)',
      'main method signature: public static void main(String[] args)',
      'Use System.out.println() to print with newline',
    ],
    interactive: {
      programData: {
        filename: 'HelloWorld.java',
        description: 'Write a complete Java program that prints "Hello, World!" to the console.',
        expectedOutput: 'Hello, World!',
        sampleSolution: `// HelloWorld.java\npublic class HelloWorld {\n    public static void main(String[] args) {\n        System.out.println("Hello, World!");\n    }\n}`,
        requiredElements: ['public class HelloWorld', 'public static void main', 'System.out.println'],
        hints: [
          'Start with: public class HelloWorld {',
          'Inside the class, add: public static void main(String[] args) {',
          'Use System.out.println("Hello, World!"); to print',
        ],
      },
    },
  },
  {
    id: 'wp-002',
    chapter: 2,
    section: '2.4',
    type: 'write_program',
    question: 'Write a complete Java program in AreaCalculator.java that calculates the area of a circle with radius 5.0 and prints the result.',
    correctAnswer: 'A program that calculates and prints the area of a circle with radius 5.0',
    explanation: 'Area of a circle = Math.PI * radius * radius. Use Math.PI for the constant.',
    keyFacts: [
      'Math.PI provides the value of pi',
      'Area formula: Math.PI * r * r',
      'Use double for floating-point values',
    ],
    interactive: {
      programData: {
        filename: 'AreaCalculator.java',
        description: 'Write a complete Java program that declares a double variable radius = 5.0, calculates the area of a circle (π × r²), and prints the result.',
        expectedOutput: '78.53981633974483',
        sampleSolution: `// AreaCalculator.java\npublic class AreaCalculator {\n    public static void main(String[] args) {\n        double radius = 5.0;\n        double area = Math.PI * radius * radius;\n        System.out.println(area);\n    }\n}`,
        requiredElements: ['public class AreaCalculator', 'public static void main', 'double', 'Math.PI'],
        hints: [
          'Declare: double radius = 5.0;',
          'Calculate: double area = Math.PI * radius * radius;',
          'Print: System.out.println(area);',
        ],
      },
    },
  },
  {
    id: 'wp-003',
    chapter: 2,
    section: '2.1',
    type: 'write_program',
    question: 'Write a complete Java program in SwapValues.java that declares int a = 10 and int b = 20, swaps their values using a temp variable, and prints both.',
    correctAnswer: 'A program that swaps two integer values and prints them',
    explanation: 'Swapping requires a temporary variable: temp = a; a = b; b = temp;',
    keyFacts: [
      'Cannot swap without a temporary variable (or XOR trick)',
      'Order matters: save one value before overwriting',
      'This is a classic variable manipulation pattern',
    ],
    interactive: {
      programData: {
        filename: 'SwapValues.java',
        description: 'Write a complete Java program that declares int a = 10 and int b = 20, swaps their values using a temporary variable, then prints a and b (each on their own line).',
        expectedOutput: '20\n10',
        sampleSolution: `// SwapValues.java\npublic class SwapValues {\n    public static void main(String[] args) {\n        int a = 10;\n        int b = 20;\n        int temp = a;\n        a = b;\n        b = temp;\n        System.out.println(a);\n        System.out.println(b);\n    }\n}`,
        requiredElements: ['public class SwapValues', 'public static void main', 'int a', 'int b'],
        hints: [
          'You need a third variable to hold one value during the swap',
          'int temp = a; then a = b; then b = temp;',
          'Print each value with System.out.println()',
        ],
      },
    },
  },
  {
    id: 'wp-004',
    chapter: 2,
    section: '2.8',
    type: 'write_program',
    question: 'Write a complete Java program in TempConverter.java that converts 98.6°F to Celsius and prints the result.',
    correctAnswer: 'A program that converts 98.6°F to Celsius',
    explanation: 'Celsius = (Fahrenheit - 32) * 5.0 / 9.0. Use 5.0/9.0 not 5/9 to avoid integer division.',
    keyFacts: [
      'Formula: C = (F - 32) × 5/9',
      'Must use 5.0/9.0 (not 5/9) to get floating-point division',
      'Integer division 5/9 equals 0 in Java!',
    ],
    interactive: {
      programData: {
        filename: 'TempConverter.java',
        description: 'Write a complete Java program that converts 98.6 degrees Fahrenheit to Celsius using the formula C = (F - 32) × 5/9 and prints the Celsius value.',
        expectedOutput: '37.0',
        sampleSolution: `// TempConverter.java\npublic class TempConverter {\n    public static void main(String[] args) {\n        double fahrenheit = 98.6;\n        double celsius = (fahrenheit - 32) * 5.0 / 9.0;\n        System.out.println(celsius);\n    }\n}`,
        requiredElements: ['public class TempConverter', 'public static void main', 'double'],
        hints: [
          'Declare: double fahrenheit = 98.6;',
          'Use 5.0/9.0, not 5/9 (integer division trap!)',
          'double celsius = (fahrenheit - 32) * 5.0 / 9.0;',
        ],
      },
    },
  },
  {
    id: 'wp-005',
    chapter: 2,
    section: '2.15',
    type: 'write_program',
    question: 'Write a complete Java program in MathDemo.java that prints the square root of 144 and 2 raised to the power of 10.',
    correctAnswer: 'A program using Math.sqrt() and Math.pow()',
    explanation: 'Java provides Math.sqrt() and Math.pow() for common mathematical operations.',
    keyFacts: [
      'Math.sqrt(x) returns the square root as a double',
      'Math.pow(base, exponent) returns base^exponent as a double',
      'Both are static methods in the Math class (no import needed)',
    ],
    interactive: {
      programData: {
        filename: 'MathDemo.java',
        description: 'Write a complete Java program that prints Math.sqrt(144) on the first line and Math.pow(2, 10) on the second line.',
        expectedOutput: '12.0\n1024.0',
        sampleSolution: `// MathDemo.java\npublic class MathDemo {\n    public static void main(String[] args) {\n        System.out.println(Math.sqrt(144));\n        System.out.println(Math.pow(2, 10));\n    }\n}`,
        requiredElements: ['public class MathDemo', 'public static void main', 'Math.sqrt', 'Math.pow'],
        hints: [
          'Math.sqrt() and Math.pow() are in java.lang.Math (auto-imported)',
          'System.out.println(Math.sqrt(144)); prints the square root',
          'System.out.println(Math.pow(2, 10)); prints 2^10',
        ],
      },
    },
  },
];

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
  ...writeProgramChallenges,
];

export function shuffleArray<T>(arr: T[]): T[] {
  const newArr = [...arr];
  for (let i = newArr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [newArr[i], newArr[j]] = [newArr[j], newArr[i]];
  }
  return newArr;
}
