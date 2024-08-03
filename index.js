const express = require('express');
const app = express();
const storage = require('node-persist');
var bodyParser = require("body-parser");
var jsonParser = bodyParser.json();


// Initialize the storage
storage.init();

// ...

app.post('/allStudents',jsonParser, async function(req, res) {
  const { studentId, name, gpa } = req.body;

  // Check if the student ID already exists in the storage
  const existingStudent = await storage.getItem(studentId);
  if (existingStudent) {
    return res.status(400).json({ message: 'Student ID already exists' });
  }

  // Create a new student object
  const student = {
    studentId: studentId,
    name: name,
    gpa: gpa
  };

  // Store the student data using studentId as the key
  await storage.setItem(studentId, student);

  // Send a success response
  res.status(201).json({ message: 'Student added successfully' });
});

// ...
app.get('/allStudents', async function(req, res) {
  let html = '<h1>All students data!</h1>';

  // Retrieve all student data from the storage
  const studentData = await storage.values();

  if (studentData.length === 0) {
    html += '<p>No student data available</p>';
  } else {
    studentData.forEach(student => {
      if (student && student.studentId && student.name && student.gpa) {
        html += `
          <div>
            <h3>Student ID: ${student.studentId}</h3>
            <h3>Name: ${student.name}</h3>
            <h3>GPA: ${student.gpa}</h3>
          </div>
          <br>
        `;
      }
    });
  }

  res.send(html);
});
app.get('/topper', async function(req, res) {
  // Retrieve all student data from the storage
  const studentData = await storage.values();

  if (studentData.length === 0) {
    res.send('No student data available');
  } else {
    let highestGPA = -Infinity;
    let topper = null;

    // Find the student with the highest GPA
    studentData.forEach(student => {
      if (student && student.gpa) {
        const gpa = parseFloat(student.gpa);

        if (gpa > highestGPA) {
          highestGPA = gpa;
          topper = student;
        }
      }
    });

    if (!topper) {
      res.send('No topper found');
    } else {
      const html = `
        <h1>Topper of the Class</h1>
        <div>
          <h3>Student ID: ${topper.studentId}</h3>
          <h3>Name: ${topper.name}</h3>
          <h3>GPA: ${topper.gpa}</h3>
        </div>
      `;
      res.send(html);
    }
  }
});

app.get('/student/:studentId', async function(req, res) {
  const studentId = req.params.studentId;

  // Retrieve the student data from the storage
  const student = await storage.getItem(studentId);

  if (!student) {
    res.status(404).send('Student not found');
  } else {
    const html = `
      <h1>Student Details</h1>
      <div>
        <h3>Student ID: ${student.studentId}</h3>
        <h3>Name: ${student.name}</h3>
        <h3>GPA: ${student.gpa}</h3>
      </div>
    `;
    res.send(html);
  }
});

// Start the server
app.listen(3000, function() {
  console.log('Server is running on port 3000');
});
