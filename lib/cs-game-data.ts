/**
 * CS-1301 Review Game - Unified Question Pool
 * Chapters 1-4: Introduction to Java, Variables, Branches, and Loops
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

import type {
  InteractiveData as CoreInteractiveData,
  Question,
} from '@brandon-gottshall/review-game-core';

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

export interface CSInteractiveData extends CoreInteractiveData {
  variantData?: VariableTraceData;
  outputData?: CodeOutputData;
  errorData?: ErrorData;
  programData?: ProgramData;
}

export type CSUnifiedQuestion = Question<CSQuestionType> & {
  chapter: number;
  section?: string;
  interactive?: CSInteractiveData;
};

// ============================================
// CHAPTER 1: INTRODUCTION TO JAVA
// ============================================

// 1.1: Computer Components
const ch1ComputerComponents: CSUnifiedQuestion[] = [
  {
    id: 'ch1-comp-001',
    concept: 'computer-components',
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
    concept: 'computer-components',
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
    concept: 'computer-components',
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
    concept: 'computer-components',
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
    concept: 'language-history',
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
    concept: 'language-history',
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
    concept: 'language-history',
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
    concept: 'language-history',
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
    concept: 'programs-instructions',
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
    concept: 'programs-instructions',
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
    concept: 'programs-instructions',
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
    concept: 'programs-instructions',
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
    concept: 'ide-concepts',
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
    concept: 'ide-concepts',
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
    concept: 'ide-concepts',
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
    concept: 'ide-concepts',
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
    concept: 'programming-basics',
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
    concept: 'programming-basics',
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
    concept: 'programming-basics',
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
    concept: 'programming-basics',
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
    concept: 'comments-whitespace',
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
    concept: 'comments-whitespace',
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
    concept: 'comments-whitespace',
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
    concept: 'comments-whitespace',
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
    concept: 'errors-debugging',
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
    concept: 'errors-debugging',
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
    concept: 'errors-debugging',
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
    concept: 'errors-debugging',
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
    concept: 'variables-assignments',
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
    concept: 'variables-assignments',
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
    concept: 'variables-assignments',
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
    concept: 'variables-assignments',
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
    concept: 'variables-assignments',
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
    concept: 'variables-assignments',
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
    concept: 'identifiers',
    chapter: 2,
    section: '2.2',
    type: 'vocabulary',
    question: 'Which of the following is NOT a valid Java identifier?',
    correctAnswer: '3rdPlace',
    distractors: ['_score', '$total', 'playerName'],
    explanation: 'Language rule: identifiers cannot start with a digit — the compiler rejects 3rdPlace. They must begin with a letter, underscore (_), or dollar sign ($). _score, $total, and playerName all compile.',
  },
  {
    id: 'ch2-ident-002',
    concept: 'identifiers',
    chapter: 2,
    section: '2.2',
    type: 'true_false',
    question: 'Variable names in Java can start with a number.',
    correctAnswer: 'False',
    distractors: ['True'],
    explanation: 'Language rule: identifiers must start with a letter, underscore (_), or dollar sign ($). A leading digit causes a compiler error. This is enforced by the Java lexer, not a style convention.',
  },
  {
    id: 'ch2-ident-003',
    concept: 'identifiers',
    chapter: 2,
    section: '2.2',
    type: 'vocabulary',
    question: 'Which of the following is NOT a valid Java identifier?',
    correctAnswer: 'first-name',
    distractors: ['firstName', '_first_name', '$firstName'],
    explanation: 'Language rule: identifiers can only contain letters, digits, underscores, and dollar signs. Hyphens are not allowed — the compiler interprets first-name as subtraction (first minus name). Convention: use camelCase (firstName) for multi-word variable names.',
  },
  {
    id: 'ch2-ident-004',
    concept: 'identifiers',
    chapter: 2,
    section: '2.2',
    type: 'valid_invalid',
    question: 'Is "class" a valid variable name in Java?',
    correctAnswer: 'Invalid - class is a reserved keyword',
    distractors: ['Valid', 'Invalid - wrong format', 'Invalid - too short'],
    explanation: 'Language rule: "class" is one of Java\'s 50+ reserved keywords — the compiler rejects it as an identifier. This is a hard language constraint, not a naming convention. Keywords like class, int, public, void, etc. can never be variable names.',
  },
  // ── Identifier edge cases ──
  {
    id: 'ch2-ident-005',
    concept: 'identifiers',
    chapter: 2,
    section: '2.2',
    type: 'valid_invalid',
    question: 'Is "$total" a valid variable name in Java?',
    correctAnswer: 'Valid — $ is a legal identifier start character',
    distractors: ['Invalid — special characters are not allowed', 'Invalid — $ is reserved for system use', 'Invalid — identifiers must start with a letter'],
    explanation: 'Language rule: identifiers can start with a letter, _ , or $. So $total compiles. Convention: $ is reserved for compiler-generated names (e.g., Outer$Inner.class). Using $ in hand-written code is legal but considered bad style.',
  },
  {
    id: 'ch2-ident-006',
    concept: 'identifiers',
    chapter: 2,
    section: '2.2',
    type: 'true_false',
    question: 'Java is case-sensitive, so "count" and "Count" are two different variables.',
    correctAnswer: 'True',
    distractors: ['False'],
    explanation: 'Language rule: Java is case-sensitive — count, Count, and COUNT are three distinct identifiers. Convention: variables use camelCase (count), classes use PascalCase (Count), constants use UPPER_SNAKE (COUNT). The compiler doesn\'t enforce this — it\'s a readability convention.',
  },
  {
    id: 'ch2-ident-007',
    concept: 'identifiers',
    chapter: 2,
    section: '2.2',
    type: 'valid_invalid',
    question: 'Is "className" a valid variable name in Java?',
    correctAnswer: 'Valid — "class" is a keyword but "className" is not',
    distractors: ['Invalid — it contains the reserved keyword "class"', 'Invalid — capital letters are not allowed mid-word', 'Invalid — variable names cannot contain the word "class"'],
    explanation: 'Language rule: only exact keyword matches are reserved. "class" is illegal, but "className" compiles fine — the compiler checks for exact token matches, not substrings. No convention conflict here; className is standard camelCase.',
  },
  {
    id: 'ch2-ident-008',
    concept: 'identifiers',
    chapter: 2,
    section: '2.2',
    type: 'vocabulary',
    question: 'Which of these is a valid Java variable name?',
    correctAnswer: 'point3D',
    distractors: ['3DPoint', 'my-var', 'for'],
    explanation: 'Language rules: identifiers cannot start with a digit (3DPoint → compiler error), cannot contain hyphens (my-var → compiler error), and cannot be a reserved keyword (for → compiler error). point3D starts with a letter and contains a digit mid-name, which is legal.',
  },
  {
    id: 'ch2-ident-009',
    concept: 'identifiers',
    chapter: 2,
    section: '2.2',
    type: 'vocabulary',
    question: 'Which of these is NOT a valid Java identifier?',
    correctAnswer: 'double',
    distractors: ['_double', '$double', 'doubleValue'],
    explanation: 'Language rule: "double" is a reserved keyword — the compiler rejects it as an identifier. _double, $double, and doubleValue all compile because they are not exact keyword matches. Convention note: $double is legal but stylistically suspicious ($ is reserved for generated code).',
  },
  {
    id: 'ch2-ident-010',
    concept: 'identifiers',
    chapter: 2,
    section: '2.2',
    type: 'true_false',
    question: 'A Java identifier can contain digits, as long as it does not start with one.',
    correctAnswer: 'True',
    distractors: ['False'],
    explanation: 'Language rule: the first character must be a letter, _ , or $; subsequent characters may also include digits (0-9). So score1, player2Name, and x99 all compile. This is enforced by the compiler, not a convention.',
  },
  {
    id: 'ch2-ident-011',
    concept: 'identifiers',
    chapter: 2,
    section: '2.2',
    type: 'vocabulary',
    question: 'A student writes: int _score = 10; — is this valid?',
    correctAnswer: 'Yes — underscores can start an identifier',
    distractors: ['No — underscores are not allowed in variable names', 'No — identifiers must start with a letter', 'Yes, but only in Java 8 and earlier'],
    explanation: 'Language rule: _score compiles in all Java versions — underscore is a legal start character. Language rule (Java 9+): a bare underscore (_) alone is now a reserved keyword and won\'t compile. Convention: leading underscores are uncommon in Java (unlike Python/C); most teams use camelCase without underscores.',
  },
  {
    id: 'ch2-ident-012',
    concept: 'identifiers',
    chapter: 2,
    section: '2.2',
    type: 'valid_invalid',
    question: 'Is "int" a valid variable name in Java?',
    correctAnswer: 'Invalid — int is a reserved keyword (primitive type)',
    distractors: ['Valid — it\'s only 3 characters but that\'s fine', 'Valid — primitive type names can be reused', 'Invalid — variable names must be at least 4 characters'],
    explanation: 'Language rule: all primitive type names (int, double, float, long, byte, short, char, boolean) are reserved keywords — the compiler rejects them as identifiers. intValue, myInt, and _int compile fine because they are not exact matches. This is a compiler-enforced rule, not a convention.',
  },
  {
    id: 'ch2-ident-013',
    concept: 'identifiers',
    chapter: 2,
    section: '2.2',
    type: 'vocabulary',
    question: 'What three characters can legally start a Java identifier?',
    correctAnswer: 'A letter, an underscore (_), or a dollar sign ($)',
    distractors: [
      'Only letters (a-z, A-Z)',
      'A letter or a digit (0-9)',
      'A letter, an underscore (_), or a hash (#)',
    ],
    explanation: 'Language rule (JLS §3.8): identifiers must start with a letter (any Unicode letter), underscore (_), or dollar sign ($). Starting with a digit, hyphen, space, or other special character causes a compiler error. This is a hard language constraint, not a naming convention.',
  },
];

// 2.5: Arithmetic Operations (Integers)
const ch2ArithmeticInt: CSUnifiedQuestion[] = [
  {
    id: 'ch2-arith-001',
    concept: 'arithmetic-int',
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
    concept: 'arithmetic-int',
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
        expectedOutput: '14\n',
      },
    },
  },
  {
    id: 'ch2-arith-003',
    concept: 'arithmetic-int',
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
        expectedOutput: '4\n',
      },
    },
  },
  {
    id: 'ch2-arith-004',
    concept: 'arithmetic-int',
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
        expectedOutput: '26\n',
      },
    },
  },
];

// 2.6: Floating-Point Numbers
const ch2FloatingPoint: CSUnifiedQuestion[] = [
  {
    id: 'ch2-float-001',
    concept: 'floating-point',
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
    concept: 'floating-point',
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
        expectedOutput: '3.5\n',
      },
    },
  },
  {
    id: 'ch2-float-003',
    concept: 'floating-point',
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
    concept: 'floating-point',
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
    concept: 'int-division-modulo',
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
    concept: 'int-division-modulo',
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
        expectedOutput: '0\n',
      },
    },
  },
  {
    id: 'ch2-divmod-003',
    concept: 'int-division-modulo',
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
    concept: 'int-division-modulo',
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
        expectedOutput: '3 r 4\n',
      },
    },
  },
];

// 2.8: Type Conversions and Casting
const ch2TypeConversions: CSUnifiedQuestion[] = [
  {
    id: 'ch2-cast-001',
    concept: 'type-conversions',
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
    concept: 'type-conversions',
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
    concept: 'type-conversions',
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
        expectedOutput: '9\n',
      },
    },
  },
  {
    id: 'ch2-cast-004',
    concept: 'type-conversions',
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
    concept: 'constants',
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
    concept: 'constants',
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
    concept: 'constants',
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
    concept: 'constants',
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
    concept: 'math-methods',
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
    concept: 'math-methods',
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
        expectedOutput: '10\n',
      },
    },
  },
  {
    id: 'ch2-math-003',
    concept: 'math-methods',
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
        expectedOutput: '43.0\n',
      },
    },
  },
  {
    id: 'ch2-math-004',
    concept: 'math-methods',
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
    concept: 'binary',
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
    concept: 'binary',
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
    concept: 'binary',
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
    concept: 'binary',
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
    concept: 'chars-strings',
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
    concept: 'chars-strings',
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
    concept: 'chars-strings',
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
        expectedOutput: 'Age: 211\n',
      },
    },
  },
  {
    id: 'ch2-chars-004',
    concept: 'chars-strings',
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
    concept: 'chars-strings',
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
        expectedOutput: 'Hello\nWorld\n',
      },
    },
  },
  {
    id: 'ch2-output-002',
    concept: 'chars-strings',
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
        expectedOutput: 'HelloWorld\n',
      },
    },
  },
  {
    id: 'ch2-output-003',
    concept: 'chars-strings',
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
        expectedOutput: 'ABC\nD\n',
      },
    },
  },
  {
    id: 'ch2-output-004',
    concept: 'chars-strings',
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
        expectedOutput: '5\n10\n15\n',
      },
    },
  },
];

// 2.13: Numeric Types
const ch2NumericTypes: CSUnifiedQuestion[] = [
  {
    id: 'ch2-numtype-001',
    concept: 'numeric-types',
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
    concept: 'numeric-types',
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
    concept: 'numeric-types',
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
    concept: 'numeric-types',
    chapter: 2,
    section: '2.13',
    type: 'vocabulary',
    question: 'A student needs to store the population of Earth (approximately 8 billion). Which type should they use?',
    correctAnswer: 'long',
    distractors: ['int', 'double', 'byte'],
    explanation: 'The maximum value for int is approximately 2.1 billion, which is too small for Earth\'s population (8 billion). You must use long, which can hold values up to about 9 quintillion.',
  },
  // ── Range vs Precision deep-dive ──
  {
    id: 'ch2-numtype-005',
    concept: 'numeric-types',
    chapter: 2,
    section: '2.13',
    type: 'true_false',
    question: 'A long can represent every integer value that a double can.',
    correctAnswer: 'False',
    distractors: ['True'],
    explanation: 'double can represent values up to ~1.7×10³⁰⁸, far beyond long\'s max of ~9.2×10¹⁸. However, double cannot exactly represent every integer — it loses precision for integers above 2⁵³. Range and precision are different invariants.',
  },
  {
    id: 'ch2-numtype-006',
    concept: 'numeric-types',
    chapter: 2,
    section: '2.13',
    type: 'true_false',
    question: 'A double can exactly represent every integer value that a long can.',
    correctAnswer: 'False',
    distractors: ['True'],
    explanation: 'double uses 52 bits for its mantissa (significand), so it can only exactly represent integers up to 2⁵³ (~9×10¹⁵). long\'s max is ~9.2×10¹⁸ — well beyond what double can represent exactly. double has greater range but less integer precision.',
  },
  {
    id: 'ch2-numtype-007',
    concept: 'numeric-types',
    chapter: 2,
    section: '2.13',
    type: 'vocabulary',
    question: 'Both long and double are 64-bit types. What is the key difference in how they use those 64 bits?',
    correctAnswer: 'long uses all 64 bits for exact integer values; double splits bits between exponent and mantissa for approximate floating-point values',
    distractors: [
      'long is signed and double is unsigned',
      'long stores values in binary but double stores values in decimal',
      'double uses 64 bits for the whole number part and 64 bits for the decimal part',
    ],
    explanation: 'long dedicates all 64 bits to represent an exact integer (one sign bit + 63 value bits). double splits its 64 bits into a sign bit, 11-bit exponent, and 52-bit mantissa — trading exact precision for an enormously larger range.',
  },
  {
    id: 'ch2-numtype-008',
    concept: 'numeric-types',
    chapter: 2,
    section: '2.13',
    type: 'vocabulary',
    question: 'You are writing a banking application that tracks account balances in whole cents. Which type should you use: long or double?',
    correctAnswer: 'long — financial calculations require exact values, and double can introduce rounding errors',
    distractors: [
      'double — it has a larger range and can handle bigger balances',
      'double — it is the default numeric type for monetary values',
      'Either one — they are both 64-bit so they behave the same',
    ],
    explanation: 'Money must be exact. double introduces rounding errors because it stores approximate floating-point values. For example, 0.1 + 0.2 ≠ 0.3 in double. Use long (storing cents) or BigDecimal for financial calculations.',
  },
  {
    id: 'ch2-numtype-009',
    concept: 'numeric-types',
    chapter: 2,
    section: '2.13',
    type: 'predict_output',
    question: 'What does this code print?',
    formula: 'long a = 9007199254740993L;\ndouble b = a;\nlong c = (long) b;\nSystem.out.println(a == c);',
    correctAnswer: 'false',
    distractors: ['true', 'Error: cannot convert long to double', 'Error: loss of precision'],
    explanation: '9007199254740993 is 2⁵³ + 1, which exceeds double\'s exact integer precision. Converting long→double→long loses the last digit. The round-tripped value differs from the original, so a == c is false. Java allows this silent precision loss without error.',
    interactive: {
      outputData: {
        code: 'long a = 9007199254740993L;\ndouble b = a;\nlong c = (long) b;\nSystem.out.println(a == c);',
        expectedOutput: 'false\n',
      },
    },
  },
  {
    id: 'ch2-numtype-010',
    concept: 'numeric-types',
    chapter: 2,
    section: '2.13',
    type: 'vocabulary',
    question: 'Why does double have a larger range than long even though both are 64-bit?',
    correctAnswer: 'double uses an exponent field that allows it to represent powers of 2 up to ~10³⁰⁸, while long can only count up to ~9.2×10¹⁸',
    distractors: [
      'double is actually 128 bits internally',
      'long wastes bits storing the decimal point location',
      'double compresses values to fit more data into 64 bits',
    ],
    explanation: 'double\'s 11-bit exponent acts as a scaling factor — like scientific notation. This lets 64 bits cover ±1.7×10³⁰⁸, but only ~15-16 significant digits are precise. long uses all bits for the value itself, giving exact results but limited to ±9.2×10¹⁸.',
  },
  {
    id: 'ch2-numtype-011',
    concept: 'numeric-types',
    chapter: 2,
    section: '2.13',
    type: 'predict_output',
    question: 'What does this code print?',
    formula: 'double x = 0.1 + 0.2;\nSystem.out.println(x == 0.3);',
    correctAnswer: 'false',
    distractors: ['true', '0.3', 'Error: cannot compare double values'],
    explanation: '0.1 and 0.2 cannot be represented exactly in binary floating-point (IEEE 754). The sum is approximately 0.30000000000000004, not exactly 0.3. This is why you should never use == to compare double values — use a tolerance check instead.',
    interactive: {
      outputData: {
        code: 'double x = 0.1 + 0.2;\nSystem.out.println(x == 0.3);',
        expectedOutput: 'false\n',
      },
    },
  },
  {
    id: 'ch2-numtype-012',
    concept: 'numeric-types',
    chapter: 2,
    section: '2.13',
    type: 'code_analysis',
    question: 'A student says: "long is pointless because double can store bigger numbers AND decimals." What is wrong with this reasoning?',
    correctAnswer: 'double sacrifices exact precision for range — it cannot exactly represent all long values, making it unsuitable for IDs, counts, and money',
    distractors: [
      'Nothing — the student is correct that double is always better',
      'long is faster because it uses fewer bits',
      'double cannot store negative numbers, so long is needed for those',
    ],
    explanation: 'double trades precision for range. Above 2⁵³, double starts skipping integers entirely. For exact values like user IDs, loop counters, or financial cents, long is correct. The student confuses magnitude (how far) with precision (how exact).',
  },
  {
    id: 'ch2-numtype-013',
    concept: 'numeric-types',
    chapter: 2,
    section: '2.13',
    type: 'predict_output',
    question: 'What does this code print?',
    formula: 'double big = 1e20;\ndouble result = big + 1 - big;\nSystem.out.println(result);',
    correctAnswer: '0.0',
    distractors: ['1.0', '1', 'Error: overflow'],
    explanation: '1e20 is so large that adding 1.0 to it produces no change — the 1 is smaller than double\'s precision at that scale. So (big + 1) == big, and big - big == 0.0. This demonstrates that double loses precision for small additions to large values.',
    interactive: {
      outputData: {
        code: 'double big = 1e20;\ndouble result = big + 1 - big;\nSystem.out.println(result);',
        expectedOutput: '0.0\n',
      },
    },
  },
  // ── Money bug sequence: show WHY long cents matters ──
  {
    id: 'ch2-numtype-014',
    concept: 'numeric-types',
    chapter: 2,
    section: '2.13',
    type: 'predict_output',
    question: 'A cashier app adds three $0.10 charges. What does this print?',
    formula: 'double total = 0.0;\nfor (int i = 0; i < 3; i++) {\n    total += 0.10;\n}\nSystem.out.println(total);',
    correctAnswer: '0.30000000000000004',
    distractors: ['0.30', '0.3', '0.1'],
    explanation: 'double cannot represent 0.1 exactly in binary (just like 1/3 can\'t be written exactly in decimal). Each += 0.10 accumulates a tiny rounding error, so after 3 additions the result is 0.30000000000000004 — not 0.30. This is why real financial software never uses double for money.',
    interactive: {
      outputData: {
        code: 'double total = 0.0;\nfor (int i = 0; i < 3; i++) {\n    total += 0.10;\n}\nSystem.out.println(total);',
        expectedOutput: '0.30000000000000004\n',
      },
    },
  },
  {
    id: 'ch2-numtype-015',
    concept: 'numeric-types',
    chapter: 2,
    section: '2.13',
    type: 'predict_output',
    question: 'Same cashier app, but now using long to store cents. What does this print?',
    formula: 'long totalCents = 0;\nfor (int i = 0; i < 3; i++) {\n    totalCents += 10;  // 10 cents\n}\nSystem.out.println(totalCents);',
    correctAnswer: '30',
    distractors: ['30.0', '0.30', '0.30000000000000004'],
    explanation: 'By storing money as whole cents in a long, every addition is exact integer arithmetic — no rounding error possible. 10 + 10 + 10 = 30 cents, always. To display as dollars, you\'d format it as totalCents / 100.0 only at the very end. This is how real banking software handles money.',
    interactive: {
      outputData: {
        code: 'long totalCents = 0;\nfor (int i = 0; i < 3; i++) {\n    totalCents += 10;\n}\nSystem.out.println(totalCents);',
        expectedOutput: '30\n',
      },
    },
  },
  {
    id: 'ch2-numtype-016',
    concept: 'numeric-types',
    chapter: 2,
    section: '2.13',
    type: 'predict_output',
    question: 'The cashier checks if the customer paid exactly $0.30. What does this print?',
    formula: 'double total = 0.0;\nfor (int i = 0; i < 3; i++) {\n    total += 0.10;\n}\nSystem.out.println(total == 0.30);',
    correctAnswer: 'false',
    distractors: ['true', '0', 'Error'],
    explanation: 'total is 0.30000000000000004, not exactly 0.30, so == returns false. This is the classic "floating-point equality trap." In a real app this bug could mean a valid payment gets rejected. The fix: store cents as long and compare integers (30 == 30 → true).',
    interactive: {
      outputData: {
        code: 'double total = 0.0;\nfor (int i = 0; i < 3; i++) {\n    total += 0.10;\n}\nSystem.out.println(total == 0.30);',
        expectedOutput: 'false\n',
      },
    },
  },
];

// 2.14: Overflow
const ch2Overflow: CSUnifiedQuestion[] = [
  {
    id: 'ch2-overflow-001',
    concept: 'overflow',
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
    concept: 'overflow',
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
    concept: 'overflow',
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
    concept: 'overflow',
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
    concept: 'random-numbers',
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
    concept: 'random-numbers',
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
    concept: 'random-numbers',
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
    concept: 'random-numbers',
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
// JAVA PROGRAM STRUCTURE — keyword drill questions
// These must be mastered BEFORE write_program questions unlock.
// ============================================
const ch1ProgramStructure: CSUnifiedQuestion[] = [
  // ── Main method signature keywords ──
  {
    id: 'ch1-struct-001',
    concept: 'java-program-structure',
    chapter: 1,
    section: '1.5',
    type: 'vocabulary',
    question: 'Fill in the blank: Every Java program starts running from the ____ method.',
    correctAnswer: 'main',
    distractors: ['start', 'run', 'begin'],
    explanation: 'Java always begins execution at the main method. Its full signature is: public static void main(String[] args)',
  },
  {
    id: 'ch1-struct-002',
    concept: 'java-program-structure',
    chapter: 1,
    section: '1.5',
    type: 'vocabulary',
    question: 'What are the four keywords that appear before "main" in the main method signature?',
    correctAnswer: 'public static void',
    distractors: ['private static void', 'public final void', 'public static int'],
    explanation: 'The main method signature is always: public static void main(String[] args). The three keywords before "main" are public, static, void — in that exact order.',
  },
  {
    id: 'ch1-struct-003',
    concept: 'java-program-structure',
    chapter: 1,
    section: '1.5',
    type: 'vocabulary',
    question: 'In the main method signature, what does "void" mean?',
    correctAnswer: 'The method does not return any value',
    distractors: ['The method is empty', 'The method takes no inputs', 'The method runs only once'],
    explanation: '"void" means the method does not give back (return) a value. The main method just runs your code — it doesn\'t produce a result that gets used elsewhere.',
  },
  {
    id: 'ch1-struct-004',
    concept: 'java-program-structure',
    chapter: 1,
    section: '1.5',
    type: 'vocabulary',
    question: 'What is the parameter type of the main method?',
    correctAnswer: 'String[]',
    distractors: ['int[]', 'void', 'char[]'],
    explanation: 'The main method always takes String[] args as its parameter. This allows the program to receive command-line arguments. You write it as: main(String[] args)',
  },
  {
    id: 'ch1-struct-005',
    concept: 'java-program-structure',
    chapter: 1,
    section: '1.5',
    type: 'true_false',
    question: 'You can change "public static void main" to "static public void main" and the program will still compile.',
    correctAnswer: 'True',
    distractors: ['False'],
    explanation: 'Java allows public and static to appear in either order. However, the standard convention is always "public static void main" — you should memorize and use this order.',
  },
  {
    id: 'ch1-struct-006',
    concept: 'java-program-structure',
    chapter: 1,
    section: '1.5',
    type: 'complete_code',
    question: 'Complete the main method signature:',
    formula: 'public ______ void main(String[] args)',
    correctAnswer: 'static',
    distractors: ['final', 'class', 'new'],
    explanation: 'The complete main method signature is: public static void main(String[] args). "static" is the second keyword.',
  },
  {
    id: 'ch1-struct-007',
    concept: 'java-program-structure',
    chapter: 1,
    section: '1.5',
    type: 'complete_code',
    question: 'Complete the main method signature:',
    formula: 'public static ______ main(String[] args)',
    correctAnswer: 'void',
    distractors: ['int', 'String', 'null'],
    explanation: 'The complete signature is: public static void main(String[] args). "void" means this method doesn\'t return a value.',
  },
  {
    id: 'ch1-struct-008',
    concept: 'java-program-structure',
    chapter: 1,
    section: '1.5',
    type: 'complete_code',
    question: 'Complete the main method parameter:',
    formula: 'public static void main(______ args)',
    correctAnswer: 'String[]',
    distractors: ['int[]', 'string[]', 'char[]'],
    explanation: 'The parameter is String[] args (capital S, square brackets). "string[]" would be wrong — Java is case-sensitive, and String is a class name.',
  },
  // ── Class/filename rule ──
  {
    id: 'ch1-struct-009',
    concept: 'java-program-structure',
    chapter: 1,
    section: '1.5',
    type: 'true_false',
    question: 'In Java, the filename must match the public class name (e.g., HelloWorld.java must contain "public class HelloWorld").',
    correctAnswer: 'True',
    distractors: ['False'],
    explanation: 'Language rule: the file HelloWorld.java must contain exactly "public class HelloWorld". If the names don\'t match, the compiler produces an error. This is enforced by the compiler, not a convention.',
  },
  {
    id: 'ch1-struct-010',
    concept: 'java-program-structure',
    chapter: 1,
    section: '1.5',
    type: 'vocabulary',
    question: 'If your file is named Calculator.java, what must the class declaration be?',
    correctAnswer: 'public class Calculator',
    distractors: ['public class calculator', 'class Calculator', 'public Calculator'],
    explanation: 'The class name must exactly match the filename (minus .java), including capitalization. "public class Calculator" in Calculator.java. Lowercase "calculator" would cause a compiler error.',
  },
  // ── Import statements ──
  {
    id: 'ch1-struct-011',
    concept: 'java-program-structure',
    chapter: 2,
    section: '2.3',
    type: 'vocabulary',
    question: 'Where do import statements go in a Java file?',
    correctAnswer: 'At the very top of the file, before the class declaration',
    distractors: ['Inside the main method', 'Inside the class but before main', 'After the class declaration'],
    explanation: 'Import statements must appear at the top of the file, before any class declaration. Example: import java.util.Scanner; goes above "public class MyProgram {"',
  },
  {
    id: 'ch1-struct-012',
    concept: 'java-program-structure',
    chapter: 2,
    section: '2.3',
    type: 'vocabulary',
    question: 'What is the correct import statement for Scanner?',
    correctAnswer: 'import java.util.Scanner;',
    distractors: ['import Scanner;', 'import java.Scanner;', 'using java.util.Scanner;'],
    explanation: 'Scanner lives in the java.util package. The full import is: import java.util.Scanner; — note the semicolon at the end. "using" is C#/C++ syntax, not Java.',
  },
  {
    id: 'ch1-struct-013',
    concept: 'java-program-structure',
    chapter: 2,
    section: '2.3',
    type: 'true_false',
    question: 'The Math class (Math.sqrt, Math.pow, Math.PI) requires an import statement.',
    correctAnswer: 'False',
    distractors: ['True'],
    explanation: 'Math is in java.lang, which is auto-imported in every Java program. You never need to write "import java.lang.Math;". Scanner, however, is in java.util and DOES require an import.',
  },
  // ── Order of elements ──
  {
    id: 'ch1-struct-014',
    concept: 'java-program-structure',
    chapter: 1,
    section: '1.5',
    type: 'vocabulary',
    question: 'What is the correct order of elements in a Java file?',
    correctAnswer: 'Import statements → class declaration → main method → statements',
    distractors: [
      'Class declaration → import statements → main method → statements',
      'Main method → class declaration → import statements → statements',
      'Import statements → main method → class declaration → statements',
    ],
    explanation: 'A Java file follows this structure: (1) imports at the top, (2) class declaration, (3) main method inside the class, (4) your code inside main. Changing this order causes compiler errors.',
  },
  {
    id: 'ch1-struct-015',
    concept: 'java-program-structure',
    chapter: 1,
    section: '1.5',
    type: 'identify_error',
    question: 'What is wrong with this program?',
    formula: 'public class Hello {\n    public static void main(String[] args) {\n        System.out.println("Hi");\n    }\n}\nimport java.util.Scanner;',
    correctAnswer: 'The import statement must be at the top of the file, not after the class',
    distractors: ['The class name should be lowercase', 'main method is missing a parameter', 'System.out.println is misspelled'],
    explanation: 'Import statements must appear before the class declaration. Placing them after the closing brace of the class causes a compiler error.',
  },
];

// ============================================
// WRITE PROGRAM CHALLENGES
// ============================================
const writeProgramChallenges: CSUnifiedQuestion[] = [
  {
    id: 'wp-001',
    concept: 'write-programs',
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
        expectedOutput: 'Hello, World!\n',
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
    concept: 'write-programs',
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
        expectedOutput: '78.53981633974483\n',
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
    concept: 'write-programs',
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
        expectedOutput: '20\n10\n',
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
    concept: 'write-programs',
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
        expectedOutput: '37.0\n',
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
    concept: 'write-programs',
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
        expectedOutput: '12.0\n1024.0\n',
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
  // ── Scanner-requiring programs ──
  {
    id: 'wp-006',
    concept: 'write-programs',
    chapter: 2,
    section: '2.3',
    type: 'write_program',
    question: 'Write a complete Java program in Greeter.java that reads the user\'s name from the keyboard and prints "Hello, <name>!"',
    correctAnswer: 'A program using Scanner to read input and print a greeting',
    explanation: 'Scanner requires an import statement: import java.util.Scanner; This is not auto-imported like Math.',
    keyFacts: [
      'Scanner must be imported: import java.util.Scanner;',
      'Create Scanner: Scanner input = new Scanner(System.in);',
      'Read a word: input.nextLine() or input.next()',
    ],
    interactive: {
      programData: {
        filename: 'Greeter.java',
        description: 'Write a complete Java program that reads the user\'s name and prints "Hello, <name>!" — you must import Scanner.',
        expectedOutput: 'Hello, Alice!\n',
        sampleSolution: `import java.util.Scanner;\n\npublic class Greeter {\n    public static void main(String[] args) {\n        Scanner input = new Scanner(System.in);\n        System.out.print("Enter your name: ");\n        String name = input.nextLine();\n        System.out.println("Hello, " + name + "!");\n    }\n}`,
        requiredElements: ['import java.util.Scanner', 'public class Greeter', 'public static void main', 'new Scanner', 'System.in'],
        hints: [
          'Scanner is in java.util — you need an import statement at the very top',
          'Create the Scanner: Scanner input = new Scanner(System.in);',
          'Read with input.nextLine(), then concatenate into "Hello, " + name + "!"',
        ],
      },
    },
  },
  {
    id: 'wp-007',
    concept: 'write-programs',
    chapter: 2,
    section: '2.5',
    type: 'write_program',
    question: 'Write a complete Java program in AddTwo.java that reads two integers from the user and prints their sum.',
    correctAnswer: 'A program using Scanner to read two ints and print the sum',
    explanation: 'Scanner.nextInt() reads an integer. Remember: Scanner requires an import, and the class name must match the filename.',
    keyFacts: [
      'Scanner must be imported: import java.util.Scanner;',
      'Read an int: input.nextInt()',
      'The class name must match the filename (AddTwo)',
    ],
    interactive: {
      programData: {
        filename: 'AddTwo.java',
        description: 'Write a complete Java program that reads two integers from the user and prints "Sum: " followed by their sum.',
        expectedOutput: 'Sum: 15\n',
        sampleSolution: `import java.util.Scanner;\n\npublic class AddTwo {\n    public static void main(String[] args) {\n        Scanner input = new Scanner(System.in);\n        System.out.print("Enter first number: ");\n        int a = input.nextInt();\n        System.out.print("Enter second number: ");\n        int b = input.nextInt();\n        System.out.println("Sum: " + (a + b));\n    }\n}`,
        requiredElements: ['import java.util.Scanner', 'public class AddTwo', 'public static void main', 'new Scanner', 'nextInt'],
        hints: [
          'Start with: import java.util.Scanner;',
          'Create Scanner, then use nextInt() to read each number',
          'Print: System.out.println("Sum: " + (a + b)); — parentheses matter for the addition!',
        ],
      },
    },
  },
  {
    id: 'wp-008',
    concept: 'write-programs',
    chapter: 2,
    section: '2.6',
    type: 'write_program',
    question: 'Write a complete Java program in CircleCalc.java that reads a radius (double) from the user and prints the area.',
    correctAnswer: 'A program using Scanner.nextDouble() and Math.PI',
    explanation: 'This combines Scanner (requires import) with Math.PI (auto-imported). A common gotcha: using nextDouble() not nextInt().',
    keyFacts: [
      'Scanner.nextDouble() reads a floating-point number',
      'Math.PI is a built-in constant (no import needed)',
      'Area formula: Math.PI * radius * radius',
    ],
    interactive: {
      programData: {
        filename: 'CircleCalc.java',
        description: 'Write a complete Java program that reads a radius (as a double) from the user and prints the area of a circle using Math.PI.',
        expectedOutput: 'Area: 78.53981633974483\n',
        sampleSolution: `import java.util.Scanner;\n\npublic class CircleCalc {\n    public static void main(String[] args) {\n        Scanner input = new Scanner(System.in);\n        System.out.print("Enter radius: ");\n        double radius = input.nextDouble();\n        double area = Math.PI * radius * radius;\n        System.out.println("Area: " + area);\n    }\n}`,
        requiredElements: ['import java.util.Scanner', 'public class CircleCalc', 'public static void main', 'new Scanner', 'Math.PI', 'nextDouble'],
        hints: [
          'You need import java.util.Scanner; — Math.PI doesn\'t need an import',
          'Read the radius: double radius = input.nextDouble();',
          'Calculate: double area = Math.PI * radius * radius;',
        ],
      },
    },
  },
];

// ============================================
// CHAPTER 3: BRANCHES
// ============================================

// 3.1: Boolean type & if-else
const ch3BooleanIfElse: CSUnifiedQuestion[] = [
  {
    id: 'ch3-bool-001',
    concept: 'boolean-type',
    chapter: 3,
    section: '3.1',
    type: 'vocabulary',
    question: 'What are the only two possible values of a boolean variable in Java?',
    correctAnswer: 'true and false',
    distractors: ['0 and 1', 'yes and no', 'on and off'],
    explanation: 'Java\'s boolean type can only hold the literals true or false (lowercase).',
  },
  {
    id: 'ch3-bool-002',
    concept: 'boolean-type',
    chapter: 3,
    section: '3.1',
    type: 'true_false',
    question: 'In Java, the value True (capital T) is equivalent to the boolean literal true.',
    correctAnswer: 'False',
    distractors: ['True'],
    explanation: 'Java is case-sensitive. Only lowercase true and false are valid boolean literals. True with a capital T is a compile error.',
  },
  {
    id: 'ch3-bool-003',
    concept: 'if-else',
    chapter: 3,
    section: '3.2',
    type: 'predict_output',
    question: 'What does this code print?\n\n```java\nint x = 7;\nif (x > 5) {\n    System.out.println("big");\n} else {\n    System.out.println("small");\n}\n```',
    correctAnswer: 'big',
    distractors: ['small', 'big\nsmall', '7'],
    explanation: '7 > 5 is true, so the if-branch executes and prints "big".',
    interactive: {
      outputData: {
        code: 'public class Test {\n    public static void main(String[] args) {\n        int x = 7;\n        if (x > 5) {\n            System.out.println("big");\n        } else {\n            System.out.println("small");\n        }\n    }\n}',
        expectedOutput: 'big\n',
      },
    },
  },
  {
    id: 'ch3-bool-004',
    concept: 'if-else',
    chapter: 3,
    section: '3.2',
    type: 'predict_output',
    question: 'What does this code print?\n\n```java\nint score = 72;\nif (score >= 90) {\n    System.out.println("A");\n} else if (score >= 80) {\n    System.out.println("B");\n} else if (score >= 70) {\n    System.out.println("C");\n} else {\n    System.out.println("F");\n}\n```',
    correctAnswer: 'C',
    distractors: ['A', 'B', 'F'],
    explanation: 'score = 72. 72 >= 90 is false, 72 >= 80 is false, 72 >= 70 is true → prints "C".',
    interactive: {
      outputData: {
        code: 'public class Test {\n    public static void main(String[] args) {\n        int score = 72;\n        if (score >= 90) { System.out.println("A"); }\n        else if (score >= 80) { System.out.println("B"); }\n        else if (score >= 70) { System.out.println("C"); }\n        else { System.out.println("F"); }\n    }\n}',
        expectedOutput: 'C\n',
      },
    },
  },
  {
    id: 'ch3-bool-005',
    concept: 'if-else',
    chapter: 3,
    section: '3.2',
    type: 'complete_code',
    question: 'Complete the if-else so it prints "even" if n is even, otherwise "odd":\n\n```java\nint n = 9;\nif (___) {\n    System.out.println("even");\n} else {\n    System.out.println("odd");\n}\n```',
    correctAnswer: 'n % 2 == 0',
    distractors: ['n / 2 == 0', 'n % 2 = 0', 'n == 2'],
    explanation: 'The modulo operator % gives the remainder. n % 2 == 0 is true when n is evenly divisible by 2.',
  },
];

// 3.2: Equality operators
const ch3EqualityOps: CSUnifiedQuestion[] = [
  {
    id: 'ch3-eq-001',
    concept: 'equality-ops',
    chapter: 3,
    section: '3.3',
    type: 'vocabulary',
    question: 'What is the equality operator in Java (tests whether two values are equal)?',
    correctAnswer: '==',
    distractors: ['=', '.equals()', '==='],
    explanation: '== is the equality operator. = is assignment. .equals() is for object content comparison. === does not exist in Java.',
  },
  {
    id: 'ch3-eq-002',
    concept: 'equality-ops',
    chapter: 3,
    section: '3.3',
    type: 'predict_output',
    question: 'What does this code print?\n\n```java\nint a = 5;\nint b = 5;\nSystem.out.println(a == b);\nSystem.out.println(a != b);\n```',
    correctAnswer: 'true\nfalse',
    distractors: ['false\ntrue', 'true\ntrue', '5\n5'],
    explanation: 'a == b is true (both are 5). a != b is false (they are equal). println on a boolean prints "true" or "false".',
    interactive: {
      outputData: {
        code: 'public class Test {\n    public static void main(String[] args) {\n        int a = 5;\n        int b = 5;\n        System.out.println(a == b);\n        System.out.println(a != b);\n    }\n}',
        expectedOutput: 'true\nfalse\n',
      },
    },
  },
  {
    id: 'ch3-eq-003',
    concept: 'equality-ops',
    chapter: 3,
    section: '3.3',
    type: 'identify_error',
    question: 'What is wrong with this code?\n\n```java\nint x = 0;\nif (x = 5) {\n    System.out.println("five");\n}\n```',
    correctAnswer: 'Using = (assignment) instead of == (equality) inside the condition',
    distractors: [
      'x should be initialized to 5',
      'Missing else clause',
      'println should be print',
    ],
    explanation: 'if (x = 5) tries to assign 5 to x and use the result as a boolean, which is a type error in Java. The condition should be x == 5.',
    formula: 'int x = 0;\nif (x = 5) {  // ERROR: assignment, not comparison\n    System.out.println("five");\n}',
  },
  {
    id: 'ch3-eq-004',
    concept: 'equality-ops',
    chapter: 3,
    section: '3.3',
    type: 'true_false',
    question: 'The != operator returns true when two values are NOT equal.',
    correctAnswer: 'True',
    distractors: ['False'],
    explanation: '!= is the "not equal" operator. It evaluates to true when the operands have different values.',
  },
];

// 3.3: Range comparisons
const ch3RangeComparisons: CSUnifiedQuestion[] = [
  {
    id: 'ch3-range-001',
    concept: 'range-comparisons',
    chapter: 3,
    section: '3.4',
    type: 'predict_output',
    question: 'What does this code print?\n\n```java\nint age = 17;\nif (age >= 16 && age < 18) {\n    System.out.println("teen driver");\n} else {\n    System.out.println("other");\n}\n```',
    correctAnswer: 'teen driver',
    distractors: ['other', 'true', '17'],
    explanation: '17 >= 16 is true AND 17 < 18 is true, so the condition is true and "teen driver" prints.',
    interactive: {
      outputData: {
        code: 'public class Test {\n    public static void main(String[] args) {\n        int age = 17;\n        if (age >= 16 && age < 18) {\n            System.out.println("teen driver");\n        } else {\n            System.out.println("other");\n        }\n    }\n}',
        expectedOutput: 'teen driver\n',
      },
    },
  },
  {
    id: 'ch3-range-002',
    concept: 'range-comparisons',
    chapter: 3,
    section: '3.4',
    type: 'identify_error',
    question: 'A student wants to check if x is between 1 and 10 (inclusive). What is wrong?\n\n```java\nif (1 <= x <= 10) {\n    System.out.println("in range");\n}\n```',
    correctAnswer: 'Java does not support chained comparisons; must use && to combine two conditions',
    distractors: [
      'Should use < instead of <=',
      'Should use || instead of &&',
      'The condition is correct Java syntax',
    ],
    explanation: 'Unlike Python, Java does not allow chained comparisons like 1 <= x <= 10. Use: if (x >= 1 && x <= 10).',
    formula: 'if (1 <= x <= 10) { // INVALID Java\nif (x >= 1 && x <= 10) { // correct',
  },
  {
    id: 'ch3-range-003',
    concept: 'range-comparisons',
    chapter: 3,
    section: '3.4',
    type: 'complete_code',
    question: 'Complete the condition to check if temperature is between 68 and 77 (inclusive):\n\n```java\nint temp = 72;\nif (___ && ___) {\n    System.out.println("comfortable");\n}\n```',
    correctAnswer: 'temp >= 68 && temp <= 77',
    distractors: ['temp > 68 && temp < 77', 'temp >= 68 || temp <= 77', '68 <= temp <= 77'],
    explanation: 'Use >= for the lower bound and <= for the upper bound, combined with &&.',
  },
  {
    id: 'ch3-range-004',
    concept: 'range-comparisons',
    chapter: 3,
    section: '3.4',
    type: 'predict_output',
    question: 'Trace the code and determine the output:\n\n```java\nint n = 15;\nString result;\nif (n < 10) {\n    result = "small";\n} else if (n < 20) {\n    result = "medium";\n} else {\n    result = "large";\n}\nSystem.out.println(result);\n```',
    correctAnswer: 'medium',
    distractors: ['small', 'large', 'null'],
    explanation: 'n = 15. 15 < 10 is false. 15 < 20 is true → result = "medium".',
    interactive: {
      outputData: {
        code: 'public class Test {\n    public static void main(String[] args) {\n        int n = 15;\n        String result;\n        if (n < 10) result = "small";\n        else if (n < 20) result = "medium";\n        else result = "large";\n        System.out.println(result);\n    }\n}',
        expectedOutput: 'medium\n',
      },
    },
  },
];

// 3.4: Logical operators
const ch3LogicalOps: CSUnifiedQuestion[] = [
  {
    id: 'ch3-log-001',
    concept: 'logical-and-or-not',
    chapter: 3,
    section: '3.5',
    type: 'vocabulary',
    question: 'Which logical operator returns true only when BOTH operands are true?',
    correctAnswer: '&&',
    distractors: ['||', '!', '&'],
    explanation: '&& (logical AND) returns true only when both left and right operands are true.',
  },
  {
    id: 'ch3-log-002',
    concept: 'logical-and-or-not',
    chapter: 3,
    section: '3.5',
    type: 'predict_output',
    question: 'What does this code print?\n\n```java\nboolean p = true;\nboolean q = false;\nSystem.out.println(p && q);\nSystem.out.println(p || q);\nSystem.out.println(!p);\n```',
    correctAnswer: 'false\ntrue\nfalse',
    distractors: ['true\nfalse\ntrue', 'false\nfalse\ntrue', 'true\ntrue\nfalse'],
    explanation: 'p && q = true && false = false. p || q = true || false = true. !p = !true = false.',
    interactive: {
      outputData: {
        code: 'public class Test {\n    public static void main(String[] args) {\n        boolean p = true;\n        boolean q = false;\n        System.out.println(p && q);\n        System.out.println(p || q);\n        System.out.println(!p);\n    }\n}',
        expectedOutput: 'false\ntrue\nfalse\n',
      },
    },
  },
  {
    id: 'ch3-log-003',
    concept: 'logical-and-or-not',
    chapter: 3,
    section: '3.5',
    type: 'true_false',
    question: 'The expression `!false` evaluates to true.',
    correctAnswer: 'True',
    distractors: ['False'],
    explanation: 'The ! (NOT) operator inverts a boolean. !false is true, !true is false.',
  },
  {
    id: 'ch3-log-004',
    concept: 'logical-and-or-not',
    chapter: 3,
    section: '3.5',
    type: 'complete_code',
    question: 'Fill in the condition to print "valid age" for ages 0 through 120 inclusive:\n\n```java\nint age = 25;\nif (___) {\n    System.out.println("valid age");\n}\n```',
    correctAnswer: 'age >= 0 && age <= 120',
    distractors: ['age >= 0 || age <= 120', 'age > 0 && age < 120', 'age != 0 && age != 120'],
    explanation: 'Both conditions must hold at the same time (&&): the age must be at least 0 and at most 120.',
  },
];

// 3.5: Short-circuit evaluation
const ch3ShortCircuit: CSUnifiedQuestion[] = [
  {
    id: 'ch3-sc-001',
    concept: 'short-circuit',
    chapter: 3,
    section: '3.6',
    type: 'vocabulary',
    question: 'What does "short-circuit evaluation" mean for the && operator?',
    correctAnswer: 'If the left operand is false, the right operand is not evaluated',
    distractors: [
      'Both operands are always evaluated before the result is determined',
      'If the left operand is true, the right operand is not evaluated',
      'The operator evaluates right-to-left',
    ],
    explanation: 'With &&, if the left side is false the whole expression must be false — Java skips evaluating the right side. This is useful for null checks: if (obj != null && obj.size() > 0).',
  },
  {
    id: 'ch3-sc-002',
    concept: 'short-circuit',
    chapter: 3,
    section: '3.6',
    type: 'true_false',
    question: 'With the || operator, Java skips evaluating the right operand when the left operand is true.',
    correctAnswer: 'True',
    distractors: ['False'],
    explanation: 'Short-circuit evaluation for ||: if the left side is true, the whole OR is true — the right side is never evaluated.',
  },
  {
    id: 'ch3-sc-003',
    concept: 'short-circuit',
    chapter: 3,
    section: '3.6',
    type: 'code_analysis',
    question: 'Given `int[] arr = null;`, which expression safely checks if the array has elements?',
    correctAnswer: 'arr != null && arr.length > 0',
    distractors: [
      'arr.length > 0 && arr != null',
      'arr != null || arr.length > 0',
      'arr.length != 0',
    ],
    explanation: 'Short-circuit &&: if arr != null is false, arr.length > 0 is never evaluated, preventing a NullPointerException. Reversing the order would crash if arr is null.',
  },
];

// 3.6: Switch statement
const ch3Switch: CSUnifiedQuestion[] = [
  {
    id: 'ch3-sw-001',
    concept: 'switch-statement',
    chapter: 3,
    section: '3.7',
    type: 'vocabulary',
    question: 'In a switch statement, what keyword matches if no case label equals the expression?',
    correctAnswer: 'default',
    distractors: ['else', 'otherwise', 'none'],
    explanation: 'The default clause in a switch is like the final else in an if-else chain — it runs when no case matches.',
  },
  {
    id: 'ch3-sw-002',
    concept: 'switch-statement',
    chapter: 3,
    section: '3.7',
    type: 'predict_output',
    question: 'What does this code print?\n\n```java\nint day = 3;\nswitch (day) {\n    case 1: System.out.println("Mon"); break;\n    case 2: System.out.println("Tue"); break;\n    case 3: System.out.println("Wed"); break;\n    default: System.out.println("Other");\n}\n```',
    correctAnswer: 'Wed',
    distractors: ['Mon', 'Tue', 'Other'],
    explanation: 'day == 3 matches case 3, which prints "Wed" then break exits the switch.',
    interactive: {
      outputData: {
        code: 'public class Test {\n    public static void main(String[] args) {\n        int day = 3;\n        switch (day) {\n            case 1: System.out.println("Mon"); break;\n            case 2: System.out.println("Tue"); break;\n            case 3: System.out.println("Wed"); break;\n            default: System.out.println("Other");\n        }\n    }\n}',
        expectedOutput: 'Wed\n',
      },
    },
  },
  {
    id: 'ch3-sw-003',
    concept: 'switch-statement',
    chapter: 3,
    section: '3.7',
    type: 'predict_output',
    question: 'What does this code print? (Note: no break in case 1)\n\n```java\nint x = 1;\nswitch (x) {\n    case 1:\n    case 2:\n        System.out.println("one or two");\n        break;\n    case 3:\n        System.out.println("three");\n        break;\n}\n```',
    correctAnswer: 'one or two',
    distractors: ['one', 'two', 'one\none or two'],
    explanation: 'Case 1 has no code and no break, so it "falls through" into case 2. Case 2 prints "one or two" then break exits.',
    interactive: {
      outputData: {
        code: 'public class Test {\n    public static void main(String[] args) {\n        int x = 1;\n        switch (x) {\n            case 1:\n            case 2: System.out.println("one or two"); break;\n            case 3: System.out.println("three"); break;\n        }\n    }\n}',
        expectedOutput: 'one or two\n',
      },
    },
  },
  {
    id: 'ch3-sw-004',
    concept: 'switch-statement',
    chapter: 3,
    section: '3.7',
    type: 'true_false',
    question: 'Omitting a break at the end of a switch case causes execution to "fall through" into the next case.',
    correctAnswer: 'True',
    distractors: ['False'],
    explanation: 'Without break, execution continues into the next case statement. This can be intentional (grouping cases) or a bug.',
  },
  {
    id: 'ch3-sw-005',
    concept: 'switch-statement',
    chapter: 3,
    section: '3.7',
    type: 'complete_code',
    question: 'Complete the switch to print the season for months 12, 1, 2:\n\n```java\nint month = 1;\nswitch (month) {\n    case 12:\n    case 1:\n    ___:\n        System.out.println("Winter");\n        break;\n    default:\n        System.out.println("Other");\n}\n```',
    correctAnswer: 'case 2',
    distractors: ['default 2', 'case: 2', '2:'],
    explanation: 'case labels use the keyword "case" followed by the value and a colon: case 2:',
  },
];

// 3.7: Ternary operator
const ch3Ternary: CSUnifiedQuestion[] = [
  {
    id: 'ch3-tern-001',
    concept: 'ternary',
    chapter: 3,
    section: '3.8',
    type: 'vocabulary',
    question: 'What is the general syntax of the ternary conditional operator?',
    correctAnswer: 'condition ? valueIfTrue : valueIfFalse',
    distractors: [
      'condition : valueIfTrue ? valueIfFalse',
      'if (condition) valueIfTrue else valueIfFalse',
      'condition ? valueIfFalse : valueIfTrue',
    ],
    explanation: 'The ternary operator has three parts: a boolean condition, a value to return if true (after ?), and a value to return if false (after :).',
  },
  {
    id: 'ch3-tern-002',
    concept: 'ternary',
    chapter: 3,
    section: '3.8',
    type: 'predict_output',
    question: 'What does this code print?\n\n```java\nint x = 10;\nString result = (x % 2 == 0) ? "even" : "odd";\nSystem.out.println(result);\n```',
    correctAnswer: 'even',
    distractors: ['odd', 'true', '0'],
    explanation: '10 % 2 == 0 is true, so the expression evaluates to "even".',
    interactive: {
      outputData: {
        code: 'public class Test {\n    public static void main(String[] args) {\n        int x = 10;\n        String result = (x % 2 == 0) ? "even" : "odd";\n        System.out.println(result);\n    }\n}',
        expectedOutput: 'even\n',
      },
    },
  },
  {
    id: 'ch3-tern-003',
    concept: 'ternary',
    chapter: 3,
    section: '3.8',
    type: 'complete_code',
    question: 'Rewrite this if-else as a single ternary expression:\n\n```java\nint a = 8, b = 3;\nint max;\nif (a > b) {\n    max = a;\n} else {\n    max = b;\n}\n// Rewrite as:\nint max2 = ___;\n```',
    correctAnswer: '(a > b) ? a : b',
    distractors: ['(a > b) ? b : a', 'a > b ? a, b', '(a > b) : a ? b'],
    explanation: 'The ternary evaluates the condition (a > b); if true it returns a, otherwise b.',
  },
];

// 3.8: Floating-point equality
const ch3FloatEq: CSUnifiedQuestion[] = [
  {
    id: 'ch3-feq-001',
    concept: 'floating-point-eq',
    chapter: 3,
    section: '3.9',
    type: 'true_false',
    question: 'Using == to compare two double values is always reliable in Java.',
    correctAnswer: 'False',
    distractors: ['True'],
    explanation: 'Floating-point arithmetic can introduce tiny rounding errors. Two values that should be equal may differ by a tiny fraction, causing == to return false unexpectedly.',
  },
  {
    id: 'ch3-feq-002',
    concept: 'floating-point-eq',
    chapter: 3,
    section: '3.9',
    type: 'code_analysis',
    question: 'Which expression correctly checks if two doubles a and b are "close enough" to be considered equal?',
    correctAnswer: 'Math.abs(a - b) < 1e-9',
    distractors: ['a == b', 'a - b == 0', 'Math.round(a) == Math.round(b)'],
    explanation: 'The standard idiom is to check if the absolute difference is smaller than a small epsilon (like 1e-9). This tolerates floating-point rounding errors.',
  },
];

// 3.9: Nested branches
const ch3NestedBranches: CSUnifiedQuestion[] = [
  {
    id: 'ch3-nest-001',
    concept: 'nested-branches',
    chapter: 3,
    section: '3.10',
    type: 'predict_output',
    question: 'What does this code print?\n\n```java\nint x = 5;\nif (x > 0) {\n    if (x > 10) {\n        System.out.println("big");\n    } else {\n        System.out.println("medium");\n    }\n} else {\n    System.out.println("negative");\n}\n```',
    correctAnswer: 'medium',
    distractors: ['big', 'negative', 'big\nmedium'],
    explanation: 'x = 5. x > 0 is true → enter outer if. x > 10 is false → print "medium".',
    interactive: {
      outputData: {
        code: 'public class Test {\n    public static void main(String[] args) {\n        int x = 5;\n        if (x > 0) {\n            if (x > 10) { System.out.println("big"); }\n            else { System.out.println("medium"); }\n        } else {\n            System.out.println("negative");\n        }\n    }\n}',
        expectedOutput: 'medium\n',
      },
    },
  },
  {
    id: 'ch3-nest-002',
    concept: 'nested-branches',
    chapter: 3,
    section: '3.10',
    type: 'true_false',
    question: 'In Java, the "dangling else" rule pairs an else clause with the nearest preceding unmatched if.',
    correctAnswer: 'True',
    distractors: ['False'],
    explanation: 'Java\'s dangling-else resolution: else always matches the innermost if that does not already have an else. Use braces {} to override this behavior.',
  },
  {
    id: 'ch3-nest-003',
    concept: 'nested-branches',
    chapter: 3,
    section: '3.10',
    type: 'predict_output',
    question: 'Trace the code and determine what it prints:\n\n```java\nint age = 15;\nboolean hasLicense = false;\nString category;\nif (age >= 16) {\n    if (hasLicense) {\n        category = "licensed driver";\n    } else {\n        category = "unlicensed";\n    }\n} else {\n    category = "too young";\n}\nSystem.out.println(category);\n```',
    correctAnswer: 'too young',
    distractors: ['licensed driver', 'unlicensed', 'null'],
    explanation: 'age = 15. age >= 16 is false → outer else → category = "too young".',
    interactive: {
      outputData: {
        code: 'public class Test {\n    public static void main(String[] args) {\n        int age = 15;\n        boolean hasLicense = false;\n        String category;\n        if (age >= 16) {\n            if (hasLicense) { category = "licensed driver"; } else { category = "unlicensed"; }\n        } else {\n            category = "too young";\n        }\n        System.out.println(category);\n    }\n}',
        expectedOutput: 'too young\n',
      },
    },
  },
];

// 3.10: String equality & access
const ch3StringEq: CSUnifiedQuestion[] = [
  {
    id: 'ch3-str-001',
    concept: 'string-equals',
    chapter: 3,
    section: '3.11',
    type: 'vocabulary',
    question: 'Which method should you use to compare two String values for equal content in Java?',
    correctAnswer: '.equals()',
    distractors: ['==', '.compareTo()', '.match()'],
    explanation: '== compares object references (memory addresses), not content. Use s1.equals(s2) to compare the actual characters in the strings.',
  },
  {
    id: 'ch3-str-002',
    concept: 'string-equals',
    chapter: 3,
    section: '3.11',
    type: 'predict_output',
    question: 'What does this code print?\n\n```java\nString a = "hello";\nString b = "hello";\nSystem.out.println(a.equals(b));\nSystem.out.println(a.equalsIgnoreCase("HELLO"));\n```',
    correctAnswer: 'true\ntrue',
    distractors: ['false\nfalse', 'true\nfalse', 'false\ntrue'],
    explanation: '.equals() returns true because the character sequences are identical. .equalsIgnoreCase() ignores case differences.',
    interactive: {
      outputData: {
        code: 'public class Test {\n    public static void main(String[] args) {\n        String a = "hello";\n        String b = "hello";\n        System.out.println(a.equals(b));\n        System.out.println(a.equalsIgnoreCase("HELLO"));\n    }\n}',
        expectedOutput: 'true\ntrue\n',
      },
    },
  },
  {
    id: 'ch3-str-003',
    concept: 'string-access',
    chapter: 3,
    section: '3.12',
    type: 'predict_output',
    question: 'What does this code print?\n\n```java\nString s = "Java";\nSystem.out.println(s.length());\nSystem.out.println(s.charAt(1));\n```',
    correctAnswer: '4\na',
    distractors: ['4\nJ', '3\na', '4\nv'],
    explanation: '"Java" has 4 characters. Index 1 (0-based) is \'a\'. J is at index 0, a at 1, v at 2, a at 3.',
    interactive: {
      outputData: {
        code: 'public class Test {\n    public static void main(String[] args) {\n        String s = "Java";\n        System.out.println(s.length());\n        System.out.println(s.charAt(1));\n    }\n}',
        expectedOutput: '4\na\n',
      },
    },
  },
  {
    id: 'ch3-str-004',
    concept: 'string-access',
    chapter: 3,
    section: '3.12',
    type: 'predict_output',
    question: 'What does this code print?\n\n```java\nString word = "hello";\nSystem.out.println(word.indexOf("l"));\nSystem.out.println(word.substring(1, 4));\n```',
    correctAnswer: '2\nell',
    distractors: ['3\nell', '2\nhell', '1\nell'],
    explanation: 'indexOf("l") returns the index of the first "l", which is 2. substring(1, 4) extracts characters from index 1 up to (not including) 4: e, l, l → "ell".',
    interactive: {
      outputData: {
        code: 'public class Test {\n    public static void main(String[] args) {\n        String word = "hello";\n        System.out.println(word.indexOf("l"));\n        System.out.println(word.substring(1, 4));\n    }\n}',
        expectedOutput: '2\nell\n',
      },
    },
  },
  {
    id: 'ch3-str-005',
    concept: 'string-ops',
    chapter: 3,
    section: '3.13',
    type: 'predict_output',
    question: 'What does this code print?\n\n```java\nString s = "  Hello World  ";\nSystem.out.println(s.trim().toLowerCase());\n```',
    correctAnswer: 'hello world',
    distractors: ['  hello world  ', 'Hello World', 'hello world  '],
    explanation: '.trim() removes leading and trailing whitespace. .toLowerCase() converts all characters to lowercase. Applied in sequence: "  Hello World  " → "Hello World" → "hello world".',
    interactive: {
      outputData: {
        code: 'public class Test {\n    public static void main(String[] args) {\n        String s = "  Hello World  ";\n        System.out.println(s.trim().toLowerCase());\n    }\n}',
        expectedOutput: 'hello world\n',
      },
    },
  },
  {
    id: 'ch3-str-006',
    concept: 'character-methods',
    chapter: 3,
    section: '3.14',
    type: 'predict_output',
    question: 'What does this code print?\n\n```java\nchar c = \'A\';\nSystem.out.println(Character.isLetter(c));\nSystem.out.println(Character.isUpperCase(c));\nSystem.out.println(Character.toLowerCase(c));\n```',
    correctAnswer: 'true\ntrue\na',
    distractors: ['true\nfalse\nA', 'false\ntrue\na', 'true\ntrue\nA'],
    explanation: '\'A\' is a letter (isLetter → true), it is uppercase (isUpperCase → true), and toLowerCase converts it to \'a\'.',
    interactive: {
      outputData: {
        code: 'public class Test {\n    public static void main(String[] args) {\n        char c = \'A\';\n        System.out.println(Character.isLetter(c));\n        System.out.println(Character.isUpperCase(c));\n        System.out.println(Character.toLowerCase(c));\n    }\n}',
        expectedOutput: 'true\ntrue\na\n',
      },
    },
  },
];

// ============================================
// CHAPTER 4: LOOPS
// ============================================

// 4.1: While loop
const ch4WhileLoop: CSUnifiedQuestion[] = [
  {
    id: 'ch4-while-001',
    concept: 'while-loop',
    chapter: 4,
    section: '4.1',
    type: 'vocabulary',
    question: 'What are the three essential components that prevent a while loop from running forever?',
    correctAnswer: 'Initialization before the loop, a condition that eventually becomes false, and an update step inside the loop',
    distractors: [
      'A break statement, a continue statement, and a return statement',
      'Opening brace, closing brace, and semicolon',
      'A counter, a limit, and a println statement',
    ],
    explanation: 'Every loop needs: (1) a variable initialized before the loop, (2) a condition tested each iteration that will eventually be false, and (3) code inside the loop that changes the variable so the condition eventually fails.',
  },
  {
    id: 'ch4-while-002',
    concept: 'while-loop',
    chapter: 4,
    section: '4.1',
    type: 'predict_output',
    question: 'What does this code print?\n\n```java\nint i = 1;\nint product = 1;\nwhile (i <= 4) {\n    product *= i;\n    i++;\n}\nSystem.out.println(product);\n```',
    correctAnswer: '24',
    distractors: ['10', '4', '120'],
    explanation: 'i goes 1,2,3,4. product = 1*1*2*3*4 = 24 (4 factorial).',
    interactive: {
      outputData: {
        code: 'public class Test {\n    public static void main(String[] args) {\n        int i = 1;\n        int product = 1;\n        while (i <= 4) { product *= i; i++; }\n        System.out.println(product);\n    }\n}',
        expectedOutput: '24\n',
      },
    },
  },
  {
    id: 'ch4-while-003',
    concept: 'while-loop',
    chapter: 4,
    section: '4.1',
    type: 'trace_variables',
    question: 'Trace the loop. What are the final values of count and sum?\n\n```java\nint count = 0;\nint sum = 0;\nint n = 5;\nwhile (n > 0) {\n    sum += n;\n    n -= 2;\n    count++;\n}\n```',
    correctAnswer: 'count = 3, sum = 9',
    formula: 'int count = 0;\nint sum = 0;\nint n = 5;\nwhile (n > 0) {\n    sum += n;\n    n -= 2;\n    count++;\n}',
    distractors: ['count = 5, sum = 15', 'count = 2, sum = 8', 'count = 3, sum = 6'],
    explanation: 'Iterations: n=5→sum=5,n=3,count=1; n=3→sum=8,n=1,count=2; n=1→sum=9,n=-1,count=3; n=-1<0 stops. Final: count=3, sum=9.',
    interactive: {
      variantData: {
        code: 'int count = 0;\nint sum = 0;\nint n = 5;\nwhile (n > 0) { sum += n; n -= 2; count++; }',
        finalValues: { count: 3, sum: 9 },
        steps: ['n=5: sum=5, n=3, count=1', 'n=3: sum=8, n=1, count=2', 'n=1: sum=9, n=-1, count=3', 'n=-1: loop ends'],
      },
    },
  },
  {
    id: 'ch4-while-004',
    concept: 'while-loop',
    chapter: 4,
    section: '4.1',
    type: 'identify_error',
    question: 'Why does this code loop forever?\n\n```java\nint i = 1;\nwhile (i <= 10) {\n    System.out.println(i);\n}\n```',
    correctAnswer: 'The variable i is never incremented, so the condition i <= 10 is always true',
    distractors: [
      'The condition should use < instead of <=',
      'println should be print',
      'i should start at 0',
    ],
    explanation: 'Without i++ (or i = i + 1) inside the loop body, i stays at 1 forever and 1 <= 10 is always true → infinite loop.',
    formula: 'int i = 1;\nwhile (i <= 10) {\n    System.out.println(i);\n    // Missing: i++;\n}',
  },
];

// 4.2: For loop
const ch4ForLoop: CSUnifiedQuestion[] = [
  {
    id: 'ch4-for-001',
    concept: 'for-loop',
    chapter: 4,
    section: '4.2',
    type: 'vocabulary',
    question: 'In a for-loop header `for (init; condition; update)`, which part runs exactly once before the loop starts?',
    correctAnswer: 'init',
    distractors: ['condition', 'update', 'All three run before the loop'],
    explanation: 'The init expression runs once at the start. The condition is tested before each iteration. The update runs after each iteration body.',
  },
  {
    id: 'ch4-for-002',
    concept: 'for-loop',
    chapter: 4,
    section: '4.2',
    type: 'predict_output',
    question: 'What does this code print?\n\n```java\nfor (int i = 0; i < 5; i++) {\n    System.out.print(i + " ");\n}\n```',
    correctAnswer: '0 1 2 3 4',
    distractors: ['1 2 3 4 5', '0 1 2 3 4 5', '0 1 2 3'],
    explanation: 'i goes from 0 to 4 (stopping before 5). Each iteration prints i followed by a space.',
    interactive: {
      outputData: {
        code: 'public class Test {\n    public static void main(String[] args) {\n        for (int i = 0; i < 5; i++) { System.out.print(i + " "); }\n    }\n}',
        expectedOutput: '0 1 2 3 4 \n',
      },
    },
  },
  {
    id: 'ch4-for-003',
    concept: 'for-loop',
    chapter: 4,
    section: '4.2',
    type: 'predict_output',
    question: 'What does this code print?\n\n```java\nint sum = 0;\nfor (int i = 1; i <= 5; i++) {\n    sum += i;\n}\nSystem.out.println(sum);\n```',
    correctAnswer: '15',
    distractors: ['10', '20', '14'],
    explanation: 'sum = 1+2+3+4+5 = 15.',
    interactive: {
      outputData: {
        code: 'public class Test {\n    public static void main(String[] args) {\n        int sum = 0;\n        for (int i = 1; i <= 5; i++) sum += i;\n        System.out.println(sum);\n    }\n}',
        expectedOutput: '15\n',
      },
    },
  },
  {
    id: 'ch4-for-004',
    concept: 'for-loop',
    chapter: 4,
    section: '4.2',
    type: 'complete_code',
    question: 'Complete the for-loop to print even numbers from 2 to 10:\n\n```java\nfor (int i = ___; i <= 10; i += ___) {\n    System.out.println(i);\n}\n```',
    correctAnswer: '2 and 2',
    distractors: ['0 and 2', '2 and 1', '1 and 2'],
    explanation: 'Start at i = 2 (first even number) and increment by 2 each time to skip odd numbers.',
  },
  {
    id: 'ch4-for-005',
    concept: 'variable-scope',
    chapter: 4,
    section: '4.3',
    type: 'identify_error',
    question: 'What is wrong with this code?\n\n```java\nfor (int i = 0; i < 5; i++) {\n    System.out.println(i);\n}\nSystem.out.println("Final i: " + i);\n```',
    correctAnswer: 'i is declared inside the for-loop header and is not accessible outside the loop',
    distractors: [
      'The loop condition should use <=',
      'You cannot use i inside println',
      'The loop is missing a break statement',
    ],
    explanation: 'Variables declared in the for-loop init clause (int i = 0) have block scope — they only exist inside the loop. Accessing i after the loop closing brace is a compile error.',
    formula: 'for (int i = 0; i < 5; i++) { /* i in scope */ }\nSystem.out.println(i); // ERROR: i out of scope',
  },
];

// 4.3: Break and continue
const ch4BreakContinue: CSUnifiedQuestion[] = [
  {
    id: 'ch4-brk-001',
    concept: 'break-continue',
    chapter: 4,
    section: '4.4',
    type: 'vocabulary',
    question: 'What does the break statement do when executed inside a loop?',
    correctAnswer: 'Immediately exits the loop, skipping all remaining iterations',
    distractors: [
      'Skips the rest of the current iteration and moves to the next',
      'Exits the entire program',
      'Restarts the loop from the beginning',
    ],
    explanation: 'break terminates the innermost enclosing loop (or switch). Execution continues with the statement after the loop.',
  },
  {
    id: 'ch4-brk-002',
    concept: 'break-continue',
    chapter: 4,
    section: '4.4',
    type: 'predict_output',
    question: 'What does this code print?\n\n```java\nfor (int i = 0; i < 10; i++) {\n    if (i == 4) break;\n    System.out.print(i + " ");\n}\n```',
    correctAnswer: '0 1 2 3',
    distractors: ['0 1 2 3 4', '0 1 2 3 4 5 6 7 8 9', '1 2 3'],
    explanation: 'When i reaches 4, break exits the loop immediately. Only 0, 1, 2, 3 are printed.',
    interactive: {
      outputData: {
        code: 'public class Test {\n    public static void main(String[] args) {\n        for (int i = 0; i < 10; i++) {\n            if (i == 4) break;\n            System.out.print(i + " ");\n        }\n    }\n}',
        expectedOutput: '0 1 2 3 \n',
      },
    },
  },
  {
    id: 'ch4-brk-003',
    concept: 'break-continue',
    chapter: 4,
    section: '4.4',
    type: 'predict_output',
    question: 'What does this code print?\n\n```java\nfor (int i = 0; i < 6; i++) {\n    if (i % 2 == 0) continue;\n    System.out.print(i + " ");\n}\n```',
    correctAnswer: '1 3 5',
    distractors: ['0 2 4', '1 2 3 4 5', '0 1 2 3 4 5'],
    explanation: 'continue skips the rest of the body when i is even. Only odd numbers (1, 3, 5) reach the print statement.',
    interactive: {
      outputData: {
        code: 'public class Test {\n    public static void main(String[] args) {\n        for (int i = 0; i < 6; i++) {\n            if (i % 2 == 0) continue;\n            System.out.print(i + " ");\n        }\n    }\n}',
        expectedOutput: '1 3 5 \n',
      },
    },
  },
  {
    id: 'ch4-brk-004',
    concept: 'break-continue',
    chapter: 4,
    section: '4.4',
    type: 'vocabulary',
    question: 'What does the continue statement do when executed inside a loop?',
    correctAnswer: 'Skips the rest of the current iteration and jumps to the update expression',
    distractors: [
      'Exits the loop entirely',
      'Restarts the loop from i = 0',
      'Exits the current method',
    ],
    explanation: 'continue jumps to the loop\'s update step (i++ in a for-loop, or re-evaluates the while condition), skipping any remaining code in the current iteration.',
  },
];

// 4.4: Nested loops
const ch4NestedLoops: CSUnifiedQuestion[] = [
  {
    id: 'ch4-nest-001',
    concept: 'nested-loops',
    chapter: 4,
    section: '4.5',
    type: 'predict_output',
    question: 'How many asterisks does this code print?\n\n```java\nfor (int i = 0; i < 3; i++) {\n    for (int j = 0; j < 4; j++) {\n        System.out.print("*");\n    }\n    System.out.println();\n}\n```',
    correctAnswer: '12',
    distractors: ['7', '3', '4'],
    explanation: 'The outer loop runs 3 times. Each time, the inner loop runs 4 times printing a "*". Total: 3 × 4 = 12 asterisks.',
    interactive: {
      outputData: {
        code: 'public class Test {\n    public static void main(String[] args) {\n        int count = 0;\n        for (int i = 0; i < 3; i++) {\n            for (int j = 0; j < 4; j++) count++;\n        }\n        System.out.println(count);\n    }\n}',
        expectedOutput: '12\n',
      },
    },
  },
  {
    id: 'ch4-nest-002',
    concept: 'nested-loops',
    chapter: 4,
    section: '4.5',
    type: 'predict_output',
    question: 'What does this code print?\n\n```java\nfor (int i = 1; i <= 3; i++) {\n    for (int j = 1; j <= 3; j++) {\n        System.out.print(i * j + " ");\n    }\n    System.out.println();\n}\n```',
    correctAnswer: '1 2 3 \n2 4 6 \n3 6 9',
    distractors: ['1 2 3 4 5 6 7 8 9', '1 4 9 \n2 5 8 \n3 6 7', '3 6 9 \n2 4 6 \n1 2 3'],
    explanation: 'This prints the 3×3 multiplication table. Row i prints i*1, i*2, i*3.',
    interactive: {
      outputData: {
        code: 'public class Test {\n    public static void main(String[] args) {\n        for (int i = 1; i <= 3; i++) {\n            for (int j = 1; j <= 3; j++) System.out.print(i * j + " ");\n            System.out.println();\n        }\n    }\n}',
        expectedOutput: '1 2 3 \n2 4 6 \n3 6 9 \n',
      },
    },
  },
  {
    id: 'ch4-nest-003',
    concept: 'nested-loops',
    chapter: 4,
    section: '4.5',
    type: 'predict_output',
    question: 'How many times does `count++` execute?\n\n```java\nint count = 0;\nfor (int i = 0; i < 4; i++) {\n    for (int j = i; j < 4; j++) {\n        count++;\n    }\n}\nSystem.out.println(count);\n```',
    correctAnswer: '10',
    distractors: ['16', '6', '8'],
    explanation: 'Inner loop runs: i=0→4 times, i=1→3 times, i=2→2 times, i=3→1 time. Total: 4+3+2+1 = 10.',
    interactive: {
      outputData: {
        code: 'public class Test {\n    public static void main(String[] args) {\n        int count = 0;\n        for (int i = 0; i < 4; i++) {\n            for (int j = i; j < 4; j++) count++;\n        }\n        System.out.println(count);\n    }\n}',
        expectedOutput: '10\n',
      },
    },
  },
];

// 4.5: Loop patterns
const ch4LoopPatterns: CSUnifiedQuestion[] = [
  {
    id: 'ch4-pat-001',
    concept: 'loop-patterns',
    chapter: 4,
    section: '4.6',
    type: 'vocabulary',
    question: 'What is an "accumulator" variable in the context of loops?',
    correctAnswer: 'A variable initialized before the loop that collects a running total or combined result',
    distractors: [
      'A variable that counts how many times the loop has run',
      'The loop variable declared in the for-loop header',
      'A variable that stores the loop condition',
    ],
    explanation: 'An accumulator pattern: initialize to 0 (for sum) or 1 (for product) before the loop, then update it each iteration: sum += value or product *= value.',
  },
  {
    id: 'ch4-pat-002',
    concept: 'loop-patterns',
    chapter: 4,
    section: '4.6',
    type: 'predict_output',
    question: 'What does this code print?\n\n```java\nint max = 0;\nint[] vals = {3, 7, 2, 9, 4};\nfor (int i = 0; i < vals.length; i++) {\n    if (vals[i] > max) max = vals[i];\n}\nSystem.out.println(max);\n```',
    correctAnswer: '9',
    distractors: ['3', '7', '4'],
    explanation: 'The loop tracks the running maximum. After scanning {3,7,2,9,4}, the maximum is 9.',
    interactive: {
      outputData: {
        code: 'public class Test {\n    public static void main(String[] args) {\n        int max = 0;\n        int[] vals = {3, 7, 2, 9, 4};\n        for (int i = 0; i < vals.length; i++) {\n            if (vals[i] > max) max = vals[i];\n        }\n        System.out.println(max);\n    }\n}',
        expectedOutput: '9\n',
      },
    },
  },
  {
    id: 'ch4-pat-003',
    concept: 'loop-patterns',
    chapter: 4,
    section: '4.6',
    type: 'complete_code',
    question: 'Complete the counter loop that counts how many numbers from 1 to 20 are divisible by 3:\n\n```java\nint count = 0;\nfor (int i = 1; i <= 20; i++) {\n    if (___) {\n        count++;\n    }\n}\nSystem.out.println(count);\n```',
    correctAnswer: 'i % 3 == 0',
    distractors: ['i / 3 == 0', 'i % 3 != 0', 'i == 3'],
    explanation: 'A number is divisible by 3 when i % 3 == 0 (remainder is zero).',
  },
];

// 4.6: Loops with strings
const ch4LoopsStrings: CSUnifiedQuestion[] = [
  {
    id: 'ch4-ls-001',
    concept: 'loops-strings',
    chapter: 4,
    section: '4.7',
    type: 'predict_output',
    question: 'What does this code print?\n\n```java\nString s = "hello";\nint vowels = 0;\nfor (int i = 0; i < s.length(); i++) {\n    char c = s.charAt(i);\n    if (c == \'a\' || c == \'e\' || c == \'i\' || c == \'o\' || c == \'u\') {\n        vowels++;\n    }\n}\nSystem.out.println(vowels);\n```',
    correctAnswer: '2',
    distractors: ['5', '3', '1'],
    explanation: '"hello" contains \'e\' and \'o\' — 2 vowels.',
    interactive: {
      outputData: {
        code: 'public class Test {\n    public static void main(String[] args) {\n        String s = "hello";\n        int vowels = 0;\n        for (int i = 0; i < s.length(); i++) {\n            char c = s.charAt(i);\n            if (c == \'a\' || c == \'e\' || c == \'i\' || c == \'o\' || c == \'u\') vowels++;\n        }\n        System.out.println(vowels);\n    }\n}',
        expectedOutput: '2\n',
      },
    },
  },
  {
    id: 'ch4-ls-002',
    concept: 'loops-strings',
    chapter: 4,
    section: '4.7',
    type: 'predict_output',
    question: 'What does this code print?\n\n```java\nString s = "Java";\nString rev = "";\nfor (int i = s.length() - 1; i >= 0; i--) {\n    rev += s.charAt(i);\n}\nSystem.out.println(rev);\n```',
    correctAnswer: 'avaJ',
    distractors: ['Java', 'avaj', 'Jav'],
    explanation: 'The loop starts at the last index (3) and iterates down to 0, appending each character. J(3)→a(2)→v(1)→a(0) appended in reverse order → "avaJ".',
    interactive: {
      outputData: {
        code: 'public class Test {\n    public static void main(String[] args) {\n        String s = "Java";\n        String rev = "";\n        for (int i = s.length() - 1; i >= 0; i--) rev += s.charAt(i);\n        System.out.println(rev);\n    }\n}',
        expectedOutput: 'avaJ\n',
      },
    },
  },
  {
    id: 'ch4-ls-003',
    concept: 'loops-strings',
    chapter: 4,
    section: '4.7',
    type: 'complete_code',
    question: 'Complete the loop to count uppercase letters in a string:\n\n```java\nString s = "HeLLo WoRLd";\nint upper = 0;\nfor (int i = 0; i < s.length(); i++) {\n    if (___) {\n        upper++;\n    }\n}\nSystem.out.println(upper);\n```',
    correctAnswer: 'Character.isUpperCase(s.charAt(i))',
    distractors: [
      's.charAt(i).isUpperCase()',
      'Character.toUpperCase(s.charAt(i))',
      's.charAt(i) >= \'A\'',
    ],
    explanation: 'Character.isUpperCase(char) returns true when the character is an uppercase letter. Always use the Character class for char classification.',
  },
];

// 4.7: Domain validation & running totals
const ch4Practice: CSUnifiedQuestion[] = [
  {
    id: 'ch4-prac-001',
    concept: 'domain-validation',
    chapter: 4,
    section: '4.8',
    type: 'code_analysis',
    question: 'A program needs to read a month number (1–12). Which loop structure is best for re-prompting until valid input is entered?',
    correctAnswer: 'while (month < 1 || month > 12) — loop until valid',
    distractors: [
      'for (int i = 0; i < 12; i++) — count 12 attempts',
      'if (month < 1 || month > 12) — check once',
      'do while (month != 0) — loop until 0',
    ],
    explanation: 'An input-validation loop keeps asking as long as the input is invalid. The while condition expresses "still invalid": while (month < 1 || month > 12).',
  },
  {
    id: 'ch4-prac-002',
    concept: 'salary-loops',
    chapter: 4,
    section: '4.9',
    type: 'predict_output',
    question: 'What does this code print?\n\n```java\nint total = 0;\nfor (int i = 1; i <= 4; i++) {\n    total += i * 100;\n}\nSystem.out.println(total);\n```',
    correctAnswer: '1000',
    distractors: ['400', '100', '2400'],
    explanation: 'total = 100 + 200 + 300 + 400 = 1000.',
    interactive: {
      outputData: {
        code: 'public class Test {\n    public static void main(String[] args) {\n        int total = 0;\n        for (int i = 1; i <= 4; i++) total += i * 100;\n        System.out.println(total);\n    }\n}',
        expectedOutput: '1000\n',
      },
    },
  },
  {
    id: 'ch4-prac-003',
    concept: 'gcd-euclid',
    chapter: 4,
    section: '4.10',
    type: 'predict_output',
    question: 'Trace Euclid\'s algorithm. What does the program print?\n\n```java\nint a = 12, b = 8;\nwhile (b != 0) {\n    int r = a % b;\n    a = b;\n    b = r;\n}\nSystem.out.println(a);\n```',
    correctAnswer: '4',
    distractors: ['8', '12', '2'],
    explanation: 'Iteration 1: r=12%8=4, a=8, b=4. Iteration 2: r=8%4=0, a=4, b=0. Loop ends (b==0). GCD(12,8) = 4.',
    interactive: {
      outputData: {
        code: 'public class Test {\n    public static void main(String[] args) {\n        int a = 12, b = 8;\n        while (b != 0) { int r = a % b; a = b; b = r; }\n        System.out.println(a);\n    }\n}',
        expectedOutput: '4\n',
      },
    },
  },
  {
    id: 'ch4-prac-004',
    concept: 'gcd-euclid',
    chapter: 4,
    section: '4.10',
    type: 'vocabulary',
    question: 'Euclid\'s GCD algorithm terminates because:',
    correctAnswer: 'Each iteration, b becomes a smaller non-negative integer, so b must eventually reach 0',
    distractors: [
      'There is a break statement that exits when a equals b',
      'Java automatically limits loops to 1000 iterations',
      'The condition b != 0 guarantees at least one iteration',
    ],
    explanation: 'The new b is a % b_old, which is strictly less than b_old (remainder is always < divisor). Since b decreases each iteration and can\'t go below 0, it must eventually reach 0.',
  },
  {
    id: 'ch4-prac-005',
    concept: 'unit-testing-branches',
    chapter: 4,
    section: '4.11',
    type: 'vocabulary',
    question: 'What are "boundary values" when testing a range check like `x >= 1 && x <= 10`?',
    correctAnswer: 'The values just inside (1, 10) and just outside (0, 11) the valid range',
    distractors: [
      'Any random values in the middle of the range',
      'Only the values 1 and 10',
      'Negative numbers and zero',
    ],
    explanation: 'Boundary testing checks the edges: 0 (just below), 1 (minimum valid), 10 (maximum valid), 11 (just above). These are most likely to expose off-by-one errors.',
  },
  {
    id: 'ch4-prac-006',
    concept: 'javadoc',
    chapter: 4,
    section: '4.12',
    type: 'vocabulary',
    question: 'Which Javadoc tag documents a method\'s return value?',
    correctAnswer: '@return',
    distractors: ['@result', '@output', '@value'],
    explanation: 'Standard Javadoc tags: @param describes a parameter, @return describes the return value, @throws describes exceptions.',
  },
  {
    id: 'ch4-prac-007',
    concept: 'javadoc',
    chapter: 4,
    section: '4.12',
    type: 'complete_code',
    question: 'Add the correct opening delimiter for a Javadoc comment:\n\n```java\n___\n * Computes the square of a number.\n * @param n the number to square\n * @return n squared\n */\n```',
    correctAnswer: '/**',
    distractors: ['/*', '//', '<!--'],
    explanation: 'Javadoc comments start with /** (two asterisks) and end with */. Regular block comments start with /* (one asterisk).',
  },
  {
    id: 'ch4-prac-008',
    concept: 'incremental-dev',
    chapter: 4,
    section: '4.13',
    type: 'vocabulary',
    question: 'What is incremental development?',
    correctAnswer: 'Building a program in small verifiable steps, testing each step before adding more',
    distractors: [
      'Writing all the code first, then testing it all at once',
      'Using a debugger to step through each line',
      'Refactoring code to remove redundancy',
    ],
    explanation: 'Incremental development: write a tiny piece, verify it works (often with a print statement), then extend. This limits how much is broken at any one time.',
  },
];

// Write-program challenges for Ch3-4
const ch34WriteProgramChallenges: CSUnifiedQuestion[] = [
  {
    id: 'ch3-wp-001',
    concept: 'if-else',
    chapter: 3,
    section: '3.2',
    type: 'write_program',
    question: 'Write a Java program that reads an integer from a variable (use 42 as the value) and prints "positive", "negative", or "zero" based on its sign.',
    correctAnswer: 'A program that uses if-else to check if the value is > 0, < 0, or == 0',
    interactive: {
      programData: {
        filename: 'SignCheck.java',
        description: 'Print the sign of the integer 42: "positive", "negative", or "zero".',
        expectedOutput: 'positive',
        sampleSolution: 'public class SignCheck {\n    public static void main(String[] args) {\n        int n = 42;\n        if (n > 0) {\n            System.out.println("positive");\n        } else if (n < 0) {\n            System.out.println("negative");\n        } else {\n            System.out.println("zero");\n        }\n    }\n}',
        requiredElements: ['if', 'else', 'System.out.println'],
      },
    },
  },
  {
    id: 'ch4-wp-001',
    concept: 'for-loop',
    chapter: 4,
    section: '4.2',
    type: 'write_program',
    question: 'Write a Java program that prints the sum of all integers from 1 to 10 using a for loop.',
    correctAnswer: '55',
    interactive: {
      programData: {
        filename: 'SumLoop.java',
        description: 'Use a for loop to compute and print the sum 1+2+3+...+10.',
        expectedOutput: '55',
        sampleSolution: 'public class SumLoop {\n    public static void main(String[] args) {\n        int sum = 0;\n        for (int i = 1; i <= 10; i++) {\n            sum += i;\n        }\n        System.out.println(sum);\n    }\n}',
        requiredElements: ['for', 'sum', 'System.out.println'],
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
  ...ch1ProgramStructure,
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
  // Chapter 3: Branches
  ...ch3BooleanIfElse,
  ...ch3EqualityOps,
  ...ch3RangeComparisons,
  ...ch3LogicalOps,
  ...ch3ShortCircuit,
  ...ch3Switch,
  ...ch3Ternary,
  ...ch3FloatEq,
  ...ch3NestedBranches,
  ...ch3StringEq,
  // Chapter 4: Loops
  ...ch4WhileLoop,
  ...ch4ForLoop,
  ...ch4BreakContinue,
  ...ch4NestedLoops,
  ...ch4LoopPatterns,
  ...ch4LoopsStrings,
  ...ch4Practice,
  ...ch34WriteProgramChallenges,
];

export function shuffleArray<T>(arr: T[]): T[] {
  const newArr = [...arr];
  for (let i = newArr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [newArr[i], newArr[j]] = [newArr[j], newArr[i]];
  }
  return newArr;
}
