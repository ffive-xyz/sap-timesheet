const chalk = require("chalk");
const boxen = require("boxen");
const pupeeteer = require("puppeteer-core");
const moment = require("moment");
const conf = require("./myConfigstore");

async function markAttendance(message, hours, startFromHours, date, project) {
  const browser = await pupeeteer.launch({
    headless: false,
    executablePath: conf.get("browserPath"),
  });
  console.log(chalk.grey("Launching Browser..."));
  const page = await browser.newPage();

  console.log(chalk.grey("Waiting for site to load..."));
  await page.goto(conf.get("url"));
  const dateElementId =
    moment(date).format("#ddd_DD_MMM_YYYY").toUpperCase() +
    `-${(hours + startFromHours) * 60}`;
  await page.waitForSelector(dateElementId);
  await page.waitForTimeout(2000);

  console.log(chalk.grey(`Selecting project...[${project}]`));
  const projectName = await page.evaluate(selectProject, project);
  console.log(chalk.grey(`Selected project: ${projectName}`));

  console.log(chalk.grey("Filling timesheet..."));
  await page.evaluate(fillAttendance, dateElementId, message);
  await page.waitForSelector(".sapMMessageToast");

  const saveResponseMessage = await page.evaluate(() => {
    return document.querySelector(".sapMMessageToast").innerText;
  });
  await browser.close();
  let responseText = chalk.red.bold("No response. Please verify");
  if (saveResponseMessage.indexOf("Your entries have been saved.") > -1) {
    responseText = chalk.green.bold(saveResponseMessage);
  } else {
    responseText = chalk.red.bold(saveResponseMessage);
  }
  console.log(boxen(responseText));
}

function selectProject(projectName) {
  const projectSelectorSidebar = document.querySelector(
    "#application-TimeEntry-manageTimeEntry-component---timesheetMain--workList-listUl"
  );
  const allProjects = projectSelectorSidebar.querySelectorAll(
    ".sapMTextMaxLine"
  );
  let selectedProject = null;
  for (const project of allProjects) {
    if (project.textContent.toLowerCase().includes(projectName.toLowerCase())) {
      selectedProject = project;
      break;
    }
  }
  if (selectedProject) {
    let selectedProjectNode = selectedProject;
    while (selectedProjectNode.nodeName != "LI") {
      selectedProjectNode = selectedProjectNode.parentNode;
    }

    let simulateEvent = function (elem, type) {
      // Create a new event
      let event = new Event(type, {
        bubbles: true,
        cancellable: true,
      });

      // Dispatch the event
      elem.dispatchEvent(event);
    };
    simulateEvent(selectedProjectNode, "mousedown");
    simulateEvent(selectedProjectNode, "focus");
    simulateEvent(selectedProjectNode, "mouseup");
    simulateEvent(selectedProjectNode, "click");
    return selectedProject.textContent;
  }
}

function fillAttendance(dateElementId, message) {
  document.querySelector(dateElementId).click();

  let taskId = 0;
  while (document.querySelector(`#\\3${taskId}`) != null) {
    taskId++;
  }
  taskId--;
  document.querySelector(`#\\3${taskId}`).click();
  const messageField = document.querySelector(
    "#application-TimeEntry-manageTimeEntry-component---timesheetMain--sfNote-inner"
  );

  let simulateEvent = function (elem, type) {
    // Create a new event
    let event = new Event(type, {
      bubbles: true,
      cancellable: true,
    });

    // Dispatch the event
    elem.dispatchEvent(event);
  };

  simulateEvent(messageField, "input");

  messageField.value = message;

  // click save
  const saveBtn = document.querySelector(
    "#application-TimeEntry-manageTimeEntry-component---timesheetMain--sfSaveBtn"
  );
  simulateEvent(saveBtn, "mousedown");
  simulateEvent(saveBtn, "focus");
  simulateEvent(saveBtn, "mouseup");
  simulateEvent(saveBtn, "click");

  // click save and submit
  const saveAndSubmit = document.querySelector(
    "#application-TimeEntry-manageTimeEntry-component---timesheetMain--saveBtn"
  );
  simulateEvent(saveAndSubmit, "mousedown");
  simulateEvent(saveAndSubmit, "focus");
  simulateEvent(saveAndSubmit, "mouseup");
  simulateEvent(saveAndSubmit, "click");
}

module.exports = {
  markAttendance,
};
