"use strict";

function checkByValues(name, values) {
    if (typeof name !== "string") throw "checkByValue: name should be a string.";
    var elements = document.getElementsByName(name);
    for (var i = 0; i < elements.length; ++i) {
        if (values.indexOf(elements[i].value) >= 0) {
            elements[i].checked = true;
        } else {
            elements[i].checked = false;
        }
    }
}

function getCheckedValues(name) {
    if (typeof name !== "string") throw "checkByValue: name should be a string.";
    var values = [];
    var elements = document.getElementsByName(name);
    for (var i = 0; i < elements.length; ++i) {
        if (elements[i].checked === true) {
            values.push(elements[i].value);
        }
    }
    return values;
}

function traverse(element, callback) {
    if (typeof element === "string") element = document.getElementById(element);
    var result = callback(element);
    if (result === true) return;
    for (var i = 0; i < element.children.length; ++i) {
        traverse(element.children[i], callback);
    }
}

function toggleNextSibling(event) {
    event.stopPropagation();
    var nextSibling = event.target.nextSibling;
    if (!(nextSibling instanceof HTMLElement)) {
        nextSibling = nextSibling.nextSibling;
    }
    if (nextSibling instanceof HTMLElement) {
        if (nextSibling.style.display === "none") {
            nextSibling.style.display = "block";
        } else {
            nextSibling.style.display = "none";
        }
    }
}

function activateTab(event) {
    event.stopPropagation();
    var id = event.target.getAttribute("href").substr(1);
    if (event.target instanceof HTMLLIElement) {
        var ulElement = event.target;
    } else if (event.target.parentNode instanceof HTMLLIElement) {
        var ulElement = event.target.parentNode;
    } else {
        throw "activateTab: can't find HTMLLIElement.";
    }

    var ulElements = ulElement.children;
    for (var i = 0; i < ulElements.length; ++i) {
        ulElements[i].classList.remove("active");
    }
    ulElement.classList.add("active");

    var divElement = document.getElementById(id);
    if (!(divElement instanceof HTMLDivElement)) {
        throw "activateTab: can't find HTMLDivElement of id = " + id;
    }
    var divElements = divElement.parentNode.children;
    for (var j = 0; j < divElements.length; ++j) {
        divElements[j].classList.remove("active");
    }
    divElement.classList.add("active");
}

