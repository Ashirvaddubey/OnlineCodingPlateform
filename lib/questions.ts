export interface TestCase {
  input: string
  expectedOutput: string
  isVisible: boolean
}

export interface Question {
  id: number
  title: string
  description: string
  constraints: string[]
  sampleInput: string
  sampleOutput: string
  testCases: TestCase[]
  difficulty: "Easy" | "Medium" | "Hard"
  category: string
  points: number
}

export const QUESTIONS: Question[] = [
  {
    id: 1,
    title: "Sales Report Analysis",
    description: `A store records sales for each day of a month. At the end, management wants to know which day had the highest sales, which had the lowest, and the average sales.

**Problem:**
Given an array of integers representing daily sales, write a program to:
- Find the maximum sales value and its day number
- Find the minimum sales value and its day number  
- Calculate the average sales for the month`,
    constraints: [
      "1 ≤ number of days ≤ 31",
      "Sales values are positive integers ≤ 10^6",
      "Use only loops and basic array operations (no built-in max/min functions)",
    ],
    sampleInput: "5\n100 200 150 300 250",
    sampleOutput: "Maximum sales: 300 on day 4\nMinimum sales: 100 on day 1\nAverage sales: 200",
    testCases: [
      {
        input: "5\n100 200 150 300 250",
        expectedOutput: "Maximum sales: 300 on day 4\nMinimum sales: 100 on day 1\nAverage sales: 200",
        isVisible: true,
      },
      {
        input: "3\n500 500 500",
        expectedOutput: "Maximum sales: 500 on day 1\nMinimum sales: 500 on day 1\nAverage sales: 500",
        isVisible: true,
      },
      {
        input: "7\n120 340 200 450 180 290 380",
        expectedOutput: "Maximum sales: 450 on day 4\nMinimum sales: 120 on day 1\nAverage sales: 280",
        isVisible: false,
      },
      {
        input: "4\n1000 800 1200 900",
        expectedOutput: "Maximum sales: 1200 on day 3\nMinimum sales: 800 on day 2\nAverage sales: 975",
        isVisible: false,
      },
      {
        input: "6\n150 150 200 100 250 300",
        expectedOutput: "Maximum sales: 300 on day 6\nMinimum sales: 100 on day 4\nAverage sales: 191",
        isVisible: false,
      },
      {
        input: "1\n750",
        expectedOutput: "Maximum sales: 750 on day 1\nMinimum sales: 750 on day 1\nAverage sales: 750",
        isVisible: false,
      },
    ],
    difficulty: "Easy",
    category: "Arrays",
    points: 10,
  },
  {
    id: 2,
    title: "Student Ranking",
    description: `A teacher wants to arrange student marks in descending order without using built-in sort functions.

**Problem:**
Given an array of marks, sort them using selection sort and display the sorted list.`,
    constraints: [
      "1 ≤ number of students ≤ 1000",
      "Marks are integers between 0 and 100",
      "No built-in sort functions allowed",
    ],
    sampleInput: "5\n85 92 78 96 88",
    sampleOutput: "96 92 88 85 78",
    testCases: [
      {
        input: "5\n85 92 78 96 88",
        expectedOutput: "96 92 88 85 78",
        isVisible: true,
      },
      {
        input: "3\n45 67 45",
        expectedOutput: "67 45 45",
        isVisible: true,
      },
      {
        input: "6\n100 95 87 92 78 85",
        expectedOutput: "100 95 92 87 85 78",
        isVisible: false,
      },
      {
        input: "4\n0 50 25 75",
        expectedOutput: "75 50 25 0",
        isVisible: false,
      },
      {
        input: "7\n88 88 88 88 88 88 88",
        expectedOutput: "88 88 88 88 88 88 88",
        isVisible: false,
      },
      {
        input: "2\n30 70",
        expectedOutput: "70 30",
        isVisible: false,
      },
    ],
    difficulty: "Easy",
    category: "Sorting",
    points: 15,
  },
  {
    id: 3,
    title: "Rotate an Array",
    description: `In a game leaderboard, the top k players are moved to the end after each round.

**Problem:**
Write a program to rotate the array of player IDs by k positions without using extra space.`,
    constraints: ["1 ≤ n ≤ 10^6", "0 ≤ k < n", "O(1) extra space, O(n) time complexity"],
    sampleInput: "5 2\n1 2 3 4 5",
    sampleOutput: "3 4 5 1 2",
    testCases: [
      {
        input: "5 2\n1 2 3 4 5",
        expectedOutput: "3 4 5 1 2",
        isVisible: true,
      },
      {
        input: "4 1\n10 20 30 40",
        expectedOutput: "20 30 40 10",
        isVisible: true,
      },
      {
        input: "6 3\n1 2 3 4 5 6",
        expectedOutput: "4 5 6 1 2 3",
        isVisible: false,
      },
      {
        input: "3 0\n7 8 9",
        expectedOutput: "7 8 9",
        isVisible: false,
      },
      {
        input: "7 4\n11 12 13 14 15 16 17",
        expectedOutput: "15 16 17 11 12 13 14",
        isVisible: false,
      },
      {
        input: "2 1\n100 200",
        expectedOutput: "200 100",
        isVisible: false,
      },
    ],
    difficulty: "Medium",
    category: "Arrays",
    points: 20,
  },
  {
    id: 4,
    title: "Find K Smallest Elements (Heap)",
    description: `You are given the prices of items in a shop. You need to find the k cheapest items.

**Problem:**
Given an array of item prices (size n) and a number k representing how many of the cheapest items to display, write a program to find the k smallest elements using a manually implemented min heap.`,
    constraints: [
      "1 ≤ n ≤ 10^5",
      "1 ≤ k ≤ n",
      "No use of built-in heap or priority_queue functions",
      "Heap must be manually implemented",
      "Time complexity should be O(n log n)",
    ],
    sampleInput: "6 3\n15 20 8 10 5 7",
    sampleOutput: "5 7 8",
    testCases: [
      {
        input: "6 3\n15 20 8 10 5 7",
        expectedOutput: "5 7 8",
        isVisible: true,
      },
      {
        input: "4 2\n100 50 75 25",
        expectedOutput: "25 50",
        isVisible: true,
      },
      {
        input: "5 4\n30 10 40 20 35",
        expectedOutput: "10 20 30 35",
        isVisible: false,
      },
      {
        input: "7 1\n45 12 67 23 89 34 56",
        expectedOutput: "12",
        isVisible: false,
      },
      {
        input: "3 3\n9 3 6",
        expectedOutput: "3 6 9",
        isVisible: false,
      },
      {
        input: "8 5\n80 60 90 40 70 50 30 20",
        expectedOutput: "20 30 40 50 60",
        isVisible: false,
      },
    ],
    difficulty: "Hard",
    category: "Heap",
    points: 25,
  },
  {
    id: 5,
    title: "Username Validator",
    description: `A website has strict rules for creating usernames to ensure consistency and avoid invalid entries. The rules are:
- The username must start with a letter (A-Z or a-z)
- It must have at least 5 characters
- It can contain only letters and digits (no spaces, symbols, or special characters)

**Problem:**
Given a string representing a username, check if it meets the given rules.
If valid → print "Valid Username"
If invalid → print "Invalid Username"`,
    constraints: [
      "5 ≤ length ≤ 20",
      "No use of built-in regex functions",
      "Only loops and basic character checks are allowed",
    ],
    sampleInput: "user123",
    sampleOutput: "Valid Username",
    testCases: [
      {
        input: "user123",
        expectedOutput: "Valid Username",
        isVisible: true,
      },
      {
        input: "123user",
        expectedOutput: "Invalid Username",
        isVisible: true,
      },
      {
        input: "validUser2024",
        expectedOutput: "Valid Username",
        isVisible: false,
      },
      {
        input: "usr",
        expectedOutput: "Invalid Username",
        isVisible: false,
      },
      {
        input: "user@123",
        expectedOutput: "Invalid Username",
        isVisible: false,
      },
      {
        input: "TestUser",
        expectedOutput: "Valid Username",
        isVisible: false,
      },
    ],
    difficulty: "Easy",
    category: "String Processing",
    points: 10,
  },
  {
    id: 6,
    title: "Word Frequency Counter",
    description: `In a chat application, the system needs to analyze messages and determine how many times each word appears. This is useful for spam detection, trending word analysis, or keyword tracking. The counting must be case-insensitive.

**Problem:**
Given a sentence, count how many times each unique word appears, ignoring case. You cannot use built-in map or dictionary data structures - you must implement the counting manually using arrays or a linked list.`,
    constraints: [
      "Sentence length ≤ 1000 characters",
      "Words are separated by spaces",
      "Case-insensitive comparison",
      "No built-in map/unordered_map/dictionary allowed",
    ],
    sampleInput: "Hello world hello",
    sampleOutput: "hello: 2\nworld: 1",
    testCases: [
      {
        input: "Hello world hello",
        expectedOutput: "hello: 2\nworld: 1",
        isVisible: true,
      },
      {
        input: "The quick brown fox jumps over the lazy dog",
        expectedOutput: "the: 2\nquick: 1\nbrown: 1\nfox: 1\njumps: 1\nover: 1\nlazy: 1\ndog: 1",
        isVisible: true,
      },
      {
        input: "Java java JAVA programming Programming",
        expectedOutput: "java: 3\nprogramming: 2",
        isVisible: false,
      },
      {
        input: "test",
        expectedOutput: "test: 1",
        isVisible: false,
      },
      {
        input: "apple Apple APPLE banana Banana",
        expectedOutput: "apple: 3\nbanana: 2",
        isVisible: false,
      },
      {
        input: "coding is fun coding is life",
        expectedOutput: "coding: 2\nis: 2\nfun: 1\nlife: 1",
        isVisible: false,
      },
    ],
    difficulty: "Medium",
    category: "String Processing",
    points: 20,
  },
  {
    id: 7,
    title: "Minimum Window Substring Finder",
    description: `A search engine's query optimizer must highlight the smallest section of text containing all the characters from the search query. This must be done efficiently because the text can be up to 100,000 characters long.

**Problem:**
Given a string T (the text) and a string S (set of characters to find), find the smallest substring of T containing all characters in S, case-insensitive. If no such substring exists, output "No valid window found".`,
    constraints: [
      "1 ≤ |T| ≤ 10^5",
      "1 ≤ |S| ≤ 52",
      "No built-in substring search functions (like find() or regex)",
      "Implement your own sliding window logic",
      "Optimize to O(n) time complexity",
    ],
    sampleInput: "ADOBECODEBANC\nABC",
    sampleOutput: "BANC",
    testCases: [
      {
        input: "ADOBECODEBANC\nABC",
        expectedOutput: "BANC",
        isVisible: true,
      },
      {
        input: "a\naa",
        expectedOutput: "No valid window found",
        isVisible: true,
      },
      {
        input: "programming\nram",
        expectedOutput: "rogramm",
        isVisible: false,
      },
      {
        input: "hello\nlo",
        expectedOutput: "lo",
        isVisible: false,
      },
      {
        input: "abcdef\nfa",
        expectedOutput: "abcdef",
        isVisible: false,
      },
      {
        input: "test\nxyz",
        expectedOutput: "No valid window found",
        isVisible: false,
      },
    ],
    difficulty: "Hard",
    category: "Sliding Window",
    points: 30,
  },
  {
    id: 8,
    title: "Longest Repeating Character Replacement",
    description: `A text compression algorithm can replace at most k characters in a substring to make all characters identical. We need to figure out the maximum possible length of such a substring.

**Problem:**
Given a string of uppercase letters A–Z and k (max number of characters you can replace), find the length of the longest substring where replacing at most k characters will make all characters the same.`,
    constraints: [
      "1 ≤ |str| ≤ 10^5",
      "Only uppercase letters allowed (A–Z)",
      "O(n) or O(n log n) solution required - brute force is not allowed",
    ],
    sampleInput: "ABAB\n2",
    sampleOutput: "4",
    testCases: [
      {
        input: "ABAB\n2",
        expectedOutput: "4",
        isVisible: true,
      },
      {
        input: "AABABBA\n1",
        expectedOutput: "4",
        isVisible: true,
      },
      {
        input: "AAAA\n0",
        expectedOutput: "4",
        isVisible: false,
      },
      {
        input: "ABCDE\n2",
        expectedOutput: "3",
        isVisible: false,
      },
      {
        input: "AABCBBA\n2",
        expectedOutput: "5",
        isVisible: false,
      },
      {
        input: "A\n1",
        expectedOutput: "1",
        isVisible: false,
      },
    ],
    difficulty: "Hard",
    category: "Sliding Window",
    points: 30,
  },
  {
    id: 9,
    title: "Playlist Manager",
    description: `You're designing a music app where each playlist is stored as a singly linked list. Each node in the linked list represents a song, storing the song's name and a pointer to the next song.

**Problem:**
Write a program to manage a playlist using a singly linked list with these operations:
- Add song at the end
- Delete song by name
- Display all songs`,
    constraints: ["1 ≤ number of songs ≤ 10^4", "Song names ≤ 50 characters"],
    sampleInput: "ADD Song1\nADD Song2\nADD Song3\nDISPLAY\nDELETE Song2\nDISPLAY",
    sampleOutput: "Song1 -> Song2 -> Song3 -> NULL\nSong1 -> Song3 -> NULL",
    testCases: [
      {
        input: "ADD Song1\nADD Song2\nADD Song3\nDISPLAY\nDELETE Song2\nDISPLAY",
        expectedOutput: "Song1 -> Song2 -> Song3 -> NULL\nSong1 -> Song3 -> NULL",
        isVisible: true,
      },
      {
        input: "ADD First\nDISPLAY\nDELETE First\nDISPLAY",
        expectedOutput: "First -> NULL\nNULL",
        isVisible: true,
      },
      {
        input: "ADD A\nADD B\nADD C\nADD D\nDELETE B\nDELETE D\nDISPLAY",
        expectedOutput: "A -> C -> NULL",
        isVisible: false,
      },
      {
        input: "DISPLAY",
        expectedOutput: "NULL",
        isVisible: false,
      },
      {
        input: "ADD Test\nDELETE NotFound\nDISPLAY",
        expectedOutput: "Test -> NULL",
        isVisible: false,
      },
      {
        input: "ADD X\nADD Y\nADD Z\nDELETE Y\nADD W\nDISPLAY",
        expectedOutput: "X -> Z -> W -> NULL",
        isVisible: false,
      },
    ],
    difficulty: "Medium",
    category: "Linked List",
    points: 20,
  },
  {
    id: 10,
    title: "Train Coach Arrangement",
    description: `You're designing a train management system. Each coach in a train is connected to both the previous and the next coach - meaning the data structure should be a doubly linked list.

**Problem:**
Create a doubly linked list with:
- Add coach at front
- Add coach at end  
- Remove a coach from middle (given the coach number)`,
    constraints: ["Number of coaches ≤ 10^5"],
    sampleInput: "ADD_FRONT A\nADD_END B\nADD_END C\nDISPLAY\nREMOVE B\nDISPLAY",
    sampleOutput: "A <-> B <-> C\nA <-> C",
    testCases: [
      {
        input: "ADD_FRONT A\nADD_END B\nADD_END C\nDISPLAY\nREMOVE B\nDISPLAY",
        expectedOutput: "A <-> B <-> C\nA <-> C",
        isVisible: true,
      },
      {
        input: "ADD_END X\nADD_FRONT Y\nDISPLAY",
        expectedOutput: "Y <-> X",
        isVisible: true,
      },
      {
        input: "ADD_FRONT P\nADD_FRONT Q\nADD_END R\nREMOVE Q\nDISPLAY",
        expectedOutput: "P <-> R",
        isVisible: false,
      },
      {
        input: "ADD_END M\nREMOVE M\nDISPLAY",
        expectedOutput: "EMPTY",
        isVisible: false,
      },
      {
        input: "ADD_FRONT 1\nADD_FRONT 2\nADD_FRONT 3\nREMOVE 2\nDISPLAY",
        expectedOutput: "3 <-> 1",
        isVisible: false,
      },
      {
        input: "DISPLAY",
        expectedOutput: "EMPTY",
        isVisible: false,
      },
    ],
    difficulty: "Medium",
    category: "Linked List",
    points: 25,
  },
  {
    id: 11,
    title: "Reverse a Linked List",
    description: `You have a music playlist stored as a singly linked list. Each song points to the next one in order. You want to reverse the playlist in-place so the last song becomes the first, and so on without using extra space.

**Problem:**
Reverse a singly linked list in-place.`,
    constraints: ["1 ≤ nodes ≤ 10^5", "O(1) extra space allowed"],
    sampleInput: "1 2 3 4 5",
    sampleOutput: "5 4 3 2 1",
    testCases: [
      {
        input: "1 2 3 4 5",
        expectedOutput: "5 4 3 2 1",
        isVisible: true,
      },
      {
        input: "10 20",
        expectedOutput: "20 10",
        isVisible: true,
      },
      {
        input: "1 2 3 4 5 6 7",
        expectedOutput: "7 6 5 4 3 2 1",
        isVisible: false,
      },
      {
        input: "42",
        expectedOutput: "42",
        isVisible: false,
      },
      {
        input: "100 200 300",
        expectedOutput: "300 200 100",
        isVisible: false,
      },
      {
        input: "9 8 7 6 5 4 3 2 1",
        expectedOutput: "1 2 3 4 5 6 7 8 9",
        isVisible: false,
      },
    ],
    difficulty: "Medium",
    category: "Linked List",
    points: 20,
  },
  {
    id: 12,
    title: "Undo Feature in Text Editor",
    description: `You're building a text editor. Every time a user types a word, it's stored in a stack. When the user presses Undo, the last typed word is removed from the text.

**Problem:**
Implement a stack where:
- push = type a word
- pop = undo last word`,
    constraints: [
      "1 ≤ number of operations ≤ 10^5",
      "Word length ≤ 50 characters",
      "No built-in stack allowed - use array",
    ],
    sampleInput: "PUSH hello\nPUSH world\nDISPLAY\nPOP\nDISPLAY\nPUSH code\nDISPLAY",
    sampleOutput: "hello world\nhello\nhello code",
    testCases: [
      {
        input: "PUSH hello\nPUSH world\nDISPLAY\nPOP\nDISPLAY\nPUSH code\nDISPLAY",
        expectedOutput: "hello world\nhello\nhello code",
        isVisible: true,
      },
      {
        input: "PUSH test\nDISPLAY\nPOP\nDISPLAY",
        expectedOutput: "test\nEMPTY",
        isVisible: true,
      },
      {
        input: "PUSH a\nPUSH b\nPUSH c\nPOP\nPOP\nDISPLAY",
        expectedOutput: "a",
        isVisible: false,
      },
      {
        input: "DISPLAY",
        expectedOutput: "EMPTY",
        isVisible: false,
      },
      {
        input: "PUSH word1\nPUSH word2\nPUSH word3\nPUSH word4\nPOP\nPOP\nDISPLAY",
        expectedOutput: "word1 word2",
        isVisible: false,
      },
      {
        input: "POP\nDISPLAY",
        expectedOutput: "EMPTY",
        isVisible: false,
      },
    ],
    difficulty: "Easy",
    category: "Stack",
    points: 15,
  },
  {
    id: 13,
    title: "Circular Queue for Parking",
    description: `You manage a parking lot with a fixed number of spots. Cars enter and leave in FIFO order, but since space is limited, the parking lot is modeled as a circular queue.

**Problem:**
You need to support:
- enqueue(carNumber) → A car enters
- dequeue() → The first car leaves
- display() → Show all cars currently parked in order`,
    constraints: [
      "Parking spots ≤ 1000",
      "No built-in queue allowed - implement your own circular queue using an array",
    ],
    sampleInput: "ENQUEUE Car1\nENQUEUE Car2\nENQUEUE Car3\nDISPLAY\nDEQUEUE\nDISPLAY\nENQUEUE Car4\nDISPLAY",
    sampleOutput: "Car1 Car2 Car3\nCar2 Car3\nCar2 Car3 Car4",
    testCases: [
      {
        input: "ENQUEUE Car1\nENQUEUE Car2\nENQUEUE Car3\nDISPLAY\nDEQUEUE\nDISPLAY\nENQUEUE Car4\nDISPLAY",
        expectedOutput: "Car1 Car2 Car3\nCar2 Car3\nCar2 Car3 Car4",
        isVisible: true,
      },
      {
        input: "ENQUEUE A\nDISPLAY\nDEQUEUE\nDISPLAY",
        expectedOutput: "A\nEMPTY",
        isVisible: true,
      },
      {
        input: "ENQUEUE X\nENQUEUE Y\nDEQUEUE\nENQUEUE Z\nDEQUEUE\nDISPLAY",
        expectedOutput: "Z",
        isVisible: false,
      },
      {
        input: "DISPLAY",
        expectedOutput: "EMPTY",
        isVisible: false,
      },
      {
        input: "ENQUEUE 1\nENQUEUE 2\nENQUEUE 3\nDEQUEUE\nDEQUEUE\nDEQUEUE\nDISPLAY",
        expectedOutput: "EMPTY",
        isVisible: false,
      },
      {
        input: "ENQUEUE P\nENQUEUE Q\nENQUEUE R\nENQUEUE S\nDEQUEUE\nDEQUEUE\nDISPLAY",
        expectedOutput: "R S",
        isVisible: false,
      },
    ],
    difficulty: "Medium",
    category: "Queue",
    points: 20,
  },
  {
    id: 14,
    title: "Employee Hierarchy (Binary Tree)",
    description: `A company wants to store employee names in a binary tree for hierarchy tracking.

**Problem:**
Create a binary tree and print the employee names using inorder traversal (Left → Root → Right).`,
    constraints: ["Number of nodes (employees) ≤ 10^5", "Employee names ≤ 50 characters"],
    sampleInput: "INSERT CEO\nINSERT Manager1\nINSERT Manager2\nINSERT Dev1\nINSERT Dev2\nINORDER",
    sampleOutput: "Dev1 Manager1 CEO Manager2 Dev2",
    testCases: [
      {
        input: "INSERT CEO\nINSERT Manager1\nINSERT Manager2\nINSERT Dev1\nINSERT Dev2\nINORDER",
        expectedOutput: "Dev1 Manager1 CEO Manager2 Dev2",
        isVisible: true,
      },
      {
        input: "INSERT Root\nINORDER",
        expectedOutput: "Root",
        isVisible: true,
      },
      {
        input: "INSERT D\nINSERT B\nINSERT F\nINSERT A\nINSERT C\nINSERT E\nINSERT G\nINORDER",
        expectedOutput: "A B C D E F G",
        isVisible: false,
      },
      {
        input: "INSERT M\nINSERT H\nINSERT R\nINSERT D\nINSERT J\nINORDER",
        expectedOutput: "D H J M R",
        isVisible: false,
      },
      {
        input: "INSERT 5\nINSERT 3\nINSERT 7\nINSERT 1\nINSERT 9\nINORDER",
        expectedOutput: "1 3 5 7 9",
        isVisible: false,
      },
      {
        input: "INORDER",
        expectedOutput: "EMPTY",
        isVisible: false,
      },
    ],
    difficulty: "Medium",
    category: "Binary Tree",
    points: 25,
  },
  {
    id: 15,
    title: "Priority-Based Job Scheduling (Heap)",
    description: `You have a set of jobs, each with a priority value. Jobs must be executed from highest priority to lowest priority.

**Problem:**
You need to implement a Max Heap manually (no built-in priority queue) to manage job scheduling.`,
    constraints: [
      "Number of jobs ≤ 10^5",
      "Job priority values are positive integers",
      "No built-in priority queue allowed - implement Max Heap using arrays",
    ],
    sampleInput: "INSERT Job1 5\nINSERT Job2 3\nINSERT Job3 8\nINSERT Job4 1\nEXTRACT\nEXTRACT\nDISPLAY",
    sampleOutput: "Job3\nJob1\nJob2 Job4",
    testCases: [
      {
        input: "INSERT Job1 5\nINSERT Job2 3\nINSERT Job3 8\nINSERT Job4 1\nEXTRACT\nEXTRACT\nDISPLAY",
        expectedOutput: "Job3\nJob1\nJob2 Job4",
        isVisible: true,
      },
      {
        input: "INSERT TaskA 10\nEXTRACT\nDISPLAY",
        expectedOutput: "TaskA\nEMPTY",
        isVisible: true,
      },
      {
        input: "INSERT A 1\nINSERT B 2\nINSERT C 3\nINSERT D 4\nEXTRACT\nEXTRACT\nEXTRACT\nDISPLAY",
        expectedOutput: "D\nC\nB\nA",
        isVisible: false,
      },
      {
        input: "INSERT X 15\nINSERT Y 20\nINSERT Z 10\nDISPLAY",
        expectedOutput: "Y X Z",
        isVisible: false,
      },
      {
        input: "EXTRACT\nDISPLAY",
        expectedOutput: "EMPTY",
        isVisible: false,
      },
      {
        input: "INSERT P1 7\nINSERT P2 7\nINSERT P3 7\nEXTRACT\nDISPLAY",
        expectedOutput: "P1\nP2 P3",
        isVisible: false,
      },
    ],
    difficulty: "Hard",
    category: "Heap",
    points: 30,
  },
]

export function getQuestionById(id: number): Question | null {
  return QUESTIONS.find((q) => q.id === id) || null
}

export function getAllQuestions(): Question[] {
  return QUESTIONS
}

export function getVisibleTestCases(questionId: number): TestCase[] {
  const question = getQuestionById(questionId)
  return question ? question.testCases.filter((tc) => tc.isVisible) : []
}

export function getAllTestCases(questionId: number): TestCase[] {
  const question = getQuestionById(questionId)
  return question ? question.testCases : []
}
