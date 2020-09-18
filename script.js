"use strict";

window.addEventListener("DOMContentLoaded", start);
let allStudents = [];

//prototype
const Student = {
    firstname: "",
    lastname: "",
    middlename: "",
    nickname: "",
    house: "",
    bloodStatus: "",
    prefect: "",
    inquisitorial: "",
    expelled: ""
}

function start() {
    console.log("start");
    loadJSON();
    registerButtons();
}

async function loadJSON() {
    const response = await fetch("https://petlatkea.dk/2020/hogwarts/students.json");
    const jsonData = await response.json();
    console.log(jsonData);

    prepareObjects(jsonData);
}

function prepareObjects(jsonData) {
    allStudents = jsonData.map(prepareObject);
    buildList();
}

function prepareObject(jsonObject) {
    const student = Object.create(Student);

    let fullname = jsonObject.fullname.trim();
    fullname = fixName(fullname);

    const firstSpace = fullname.indexOf(" ");
    const lastSpace = fullname.lastIndexOf(" ");

    student.firstname = fullname.substring(0, firstSpace);
    student.lastname = fullname.substring(lastSpace);
    student.middlename = fullname.substring(firstSpace, lastSpace);
    if (student.middlename.includes("\"") === true) {
        student.nickname = student.middlename.replaceAll("\"", "").trim();
        student.nickname = student.nickname.substring(0, 1).toUpperCase() + student.nickname.substring(1);
        student.middlename = "\n";
    }
    student.house = jsonObject.house.trim().capitalize();

    student.bloodStatus = "n/a";
    student.prefect = "n/a";
    student.inquisitorial = "n/a";
    student.expelled = "n/a";


    return student;
}

function buildList() {
    const currentList = allStudents;

    displayList(currentList);
}

function displayList(students) {
    document.querySelector("#list tbody").innerHTML = "";
    students.forEach(displayStudent);
}

function displayStudent(student) {
    const clone = document.querySelector("template#student").content.cloneNode(true);

    clone.querySelector("[data-field=firstname]").textContent = student.firstname;
    clone.querySelector("[data-field=lastname]").textContent = student.lastname;
    clone.querySelector("[data-field=middlename]").textContent = student.middlename;
    clone.querySelector("[data-field=nickname]").textContent = student.nickname;
    clone.querySelector("[data-field=house]").textContent = student.house;
    clone.querySelector("[data-field=blood-status]").textContent = student.bloodStatus;
    clone.querySelector("[data-field=prefect]").textContent = student.prefect;
    clone.querySelector("[data-field=inquisitorial]").textContent = student.inquisitorial;
    clone.querySelector("[data-field=expelled]").textContent = student.expelled;

    document.querySelector("#list tbody").appendChild(clone);
}

function fixName(fullname) {
    let capLetters = fullname[0].toUpperCase();
    for (let i = 1; i <= fullname.length - 1; i++) {
        let currentLetter, previousLetter = fullname[i - 1];
        if (previousLetter && previousLetter == " " || previousLetter && previousLetter == "-") {
            currentLetter = fullname[i].toUpperCase();
        } else {
            currentLetter = fullname[i].toLowerCase();
        }
        capLetters = capLetters + currentLetter;
    }
    fullname = capLetters;
    console.log(fullname);
    return fullname;
}

function getMiddleName(fullname) {
    const firstSpace = fullname.indexOf(" ");
    const lastSpace = fullname.lastIndexOf(" ");

    student.middlename = fullname.substring(firstSpace, lastSpace);
    if (student.middlename.includes("\"") === true) {
        student.nickname = student.middlename.replaceAll("\"", "").trim();
        student.nickname = student.nickname.substring(0, 1).toUpperCase() + student.nickname.substring(1);

        student.middlename = "\n";

    } else if (student.middlename === "") {
        student.middlename = "\n";
    } else {
        student.middlename = fullname.substring(firstSpace + 1, firstSpace + 2).toUpperCase() + fullname.substring(firstSpace + 2, lastSpace);
    }
}

String.prototype.capitalize = function () {
    return this.charAt(0).toUpperCase() + this.slice(1).toLowerCase();
}

function selectFilter(event) {
    const filter = event.target.dataset.filter;
    console.log("user selected " + filter);
    filterList(filter);
}

function filterList(filterBy) {
    let filteredList = allStudents;

    if (filterBy === "gryffindor") {
        filteredList = allStudents.filter(isGryffindor);
    }
    if (filterBy === "slytherin") {
        filteredList = allStudents.filter(isSlytherin);
    }
    if (filterBy === "hufflepuff") {
        filteredList = allStudents.filter(isHufflepuff);
    }
    if (filterBy === "ravenclaw") {
        filteredList = allStudents.filter(isRavenclaw);
    }


    displayList(filteredList)
}

function isGryffindor(student) {
    return student.house === "Gryffindor";
}

function isSlytherin(student) {
    return student.house === "Slytherin";
}

function isHufflepuff(student) {
    return student.house === "Hufflepuff";
}

function isRavenclaw(student) {
    return student.house === "Ravenclaw";
}

function registerButtons() {
    document.querySelectorAll("[data-action='filter']").forEach(button => button.addEventListener("click", selectFilter));
}