/**
 * ClimaQuest - Climate Simulation Game
 * MVP Implementation
 */

// Core game engine
class Game {
  constructor(config = {}) {
    this.config = {
      startYear: 2025,
      endYear: 2100,
      difficultyLevel: 'normal',
      ...config
    };
    
    this.currentYear = this.config.startYear;
    this.gameOver = false;
    this.score = 0;
    this.resources = 1000;
    this.co2Level = 415; // Starting at approximate 2025 levels (ppm)
    this.temperature = 1.5; // Starting at 1.5°C above pre-industrial levels
    this.happiness = 70; // Population happiness (0-100)
    this.missionSystem = new MissionSystem(this);
    this.activeEffects = [];
    
    this.metrics = {
      emissions: 36.5, // Annual CO2 emissions in gigatons
      renewablePercentage: 20,
      deforestationRate: 5,
      oceanAcidity: 8.1
    };
  }

  initialize() {
    console.log('ClimaQuest initialized!');
    console.log(`Starting in year ${this.currentYear} with goal to reach ${this.config.endYear}`);
    this.missionSystem.generateInitialMissions();
    this.updateUI();
  }

  advanceYear() {
    if (this.gameOver) return;
    
    this.currentYear++;
    this.updateClimateModel();
    this.missionSystem.updateMissions();
    this.applyActiveEffects();
    this.checkGameEndConditions();
    this.updateUI();
    
    return {
      year: this.currentYear,
      temperature: this.temperature,
      co2Level: this.co2Level,
      resources: this.resources,
      happiness: this.happiness
    };
  }

  updateClimateModel() {
    // Simple climate model for MVP
    // CO2 increases based on emissions minus carbon capture/reduction efforts
    const netEmissions = this.metrics.emissions * (1 - (this.metrics.renewablePercentage / 100));
    this.co2Level += netEmissions / 10;
    
    // Temperature follows CO2 with some delay
    const targetTemp = 1.5 + ((this.co2Level - 415) / 100);
    this.temperature = this.temperature + (targetTemp - this.temperature) * 0.2;
    
    // Resource generation/consumption
    this.resources += (100 - (this.metrics.renewablePercentage / 2));
    
    // Happiness calculation
    const tempEffect = Math.max(0, (this.temperature - 1.5) * 5);
    const resourceEffect = Math.min(20, this.resources / 100);
    this.happiness = Math.max(0, Math.min(100, this.happiness - tempEffect + resourceEffect));
    
    // Update other metrics
    this.metrics.oceanAcidity = 8.1 + ((this.co2Level - 415) / 1000);
  }

  implementPolicy(policy) {
    if (this.resources < policy.cost) {
      return false;
    }
    
    this.resources -= policy.cost;
    
    // Apply immediate effects
    Object.keys(policy.immediate).forEach(key => {
      if (this.metrics[key] !== undefined) {
        this.metrics[key] += policy.immediate[key];
      } else if (key === 'happiness') {
        this.happiness += policy.immediate[key];
      }
    });
    
    // Add lasting effects
    if (policy.effects) {
      policy.effects.forEach(effect => {
        this.activeEffects.push({
          ...effect,
          remainingYears: effect.duration || 1
        });
      });
    }
    
    return true;
  }

  applyActiveEffects() {
    // Apply all active effects
    this.activeEffects.forEach(effect => {
      Object.keys(effect.annual).forEach(key => {
        if (this.metrics[key] !== undefined) {
          this.metrics[key] += effect.annual[key];
        } else if (key === 'happiness') {
          this.happiness += effect.annual[key];
        }
      });
    });
    
    // Remove expired effects
    this.activeEffects = this.activeEffects
      .map(effect => ({...effect, remainingYears: effect.remainingYears - 1}))
      .filter(effect => effect.remainingYears > 0);
  }

  completeMission(missionId) {
    const reward = this.missionSystem.completeMission(missionId);
    if (reward) {
      this.score += reward.score || 0;
      this.resources += reward.resources || 0;
      this.happiness += reward.happiness || 0;
      return true;
    }
    return false;
  }

  checkGameEndConditions() {
    // End conditions
    if (this.currentYear >= this.config.endYear) {
      this.gameOver = true;
      if (this.temperature < 2.0) {
        this.endResult = 'success';
      } else {
        this.endResult = 'failure';
      }
    }
    
    // Disaster scenario
    if (this.temperature > 3.0) {
      this.gameOver = true;
      this.endResult = 'disaster';
    }
    
    // Bankruptcy
    if (this.resources <= 0) {
      this.gameOver = true;
      this.endResult = 'bankrupt';
    }
    
    // Revolution
    if (this.happiness <= 10) {
      this.gameOver = true;
      this.endResult = 'revolution';
    }
    
    return this.gameOver;
  }
  
  updateUI() {
    // Update the UI with current game state
    document.getElementById('year').textContent = this.currentYear;
    document.getElementById('temperature').textContent = this.temperature.toFixed(1) + '°C';
    document.getElementById('co2-level').textContent = Math.round(this.co2Level) + ' ppm';
    document.getElementById('resources').textContent = Math.round(this.resources);
    document.getElementById('happiness').textContent = Math.round(this.happiness) + '%';
    
    // Update progress bars
    document.getElementById('temp-progress').style.width = (this.temperature / 4 * 100) + '%';
    document.getElementById('happiness-progress').style.width = this.happiness + '%';
    document.getElementById('resources-progress').style.width = Math.min(100, this.resources / 20) + '%';
    
    // Update mission list
    this.renderMissions();
    
    // Check if game is over
    if (this.gameOver) {
      this.showEndScreen();
    }
  }
  
  renderMissions() {
    const missionContainer = document.getElementById('missions-list');
    missionContainer.innerHTML = '';
    
    this.missionSystem.activeMissions.forEach(mission => {
      const missionElement = document.createElement('div');
      missionElement.classList.add('mission');
      missionElement.innerHTML = `
        <h4>${mission.title}</h4>
        <p>${mission.description}</p>
        <div class="mission-rewards">
          ${mission.reward.score ? `<span>+${mission.reward.score} points</span>` : ''}
          ${mission.reward.resources ? `<span>+${mission.reward.resources} resources</span>` : ''}
        </div>
        <button class="complete-mission" data-id="${mission.id}">Complete</button>
      `;
      missionContainer.appendChild(missionElement);
    });
    
    // Add event listeners
    document.querySelectorAll('.complete-mission').forEach(button => {
      button.addEventListener('click', (e) => {
        const missionId = e.target.getAttribute('data-id');
        this.completeMission(missionId);
      });
    });
  }
  
  showEndScreen() {
    const gameContainer = document.getElementById('game-container');
    const endScreen = document.createElement('div');
    endScreen.classList.add('end-screen');
    
    let endMessage = '';
    switch(this.endResult) {
      case 'success':
        endMessage = `
          <h2>Success!</h2>
          <p>You've managed to keep global warming under 2°C by ${this.currentYear}!</p>
          <p>Final temperature: ${this.temperature.toFixed(1)}°C</p>
          <p>Final score: ${this.score}</p>
        `;
        break;
      case 'failure':
        endMessage = `
          <h2>We tried...</h2>
          <p>You weren't able to limit warming below 2°C.</p>
          <p>Final temperature: ${this.temperature.toFixed(1)}°C</p>
          <p>Final score: ${this.score}</p>
        `;
        break;
      case 'disaster':
        endMessage = `
          <h2>Climate Disaster!</h2>
          <p>Temperature has risen above 3°C causing cascading climate effects.</p>
          <p>Final temperature: ${this.temperature.toFixed(1)}°C</p>
        `;
        break;
      case 'bankrupt':
        endMessage = `
          <h2>Bankruptcy!</h2>
          <p>Your economy collapsed trying to manage climate change.</p>
          <p>Final temperature: ${this.temperature.toFixed(1)}°C</p>
        `;
        break;
      case 'revolution':
        endMessage = `
          <h2>Revolution!</h2>
          <p>The people have overthrown your government due to low happiness.</p>
          <p>Final temperature: ${this.temperature.toFixed(1)}°C</p>
        `;
        break;
    }
    
    endScreen.innerHTML = `
      <div class="end-content">
        ${endMessage}
        <button id="play-again">Play Again</button>
      </div>
    `;
    
    gameContainer.appendChild(endScreen);
    document.getElementById('play-again').addEventListener('click', () => {
      endScreen.remove();
      initGame();
    });
  }
}

// Mission system implementation
class MissionSystem {
  constructor(game) {
    this.game = game;
    this.activeMissions = [];
    this.completedMissions = [];
    this.missionPool = this.generateMissionPool();
    this.missionIdCounter = 0;
  }
  
  generateMissionPool() {
    // All potential missions in the game
    return [
      {
        title: "Renewable Energy Pioneer",
        description: "Increase renewable energy percentage by 10%",
        difficulty: "easy",
        checkCompletion: () => {
          const startingValue = this.game.metrics.renewablePercentage;
          return (game) => game.metrics.renewablePercentage >= startingValue + 10;
        },
        reward: {
          score: 100,
          resources: 150
        }
      },
      {
        title: "Emissions Reduction Target",
        description: "Reduce annual emissions by 5 gigatons",
        difficulty: "medium",
        checkCompletion: () => {
          const startingValue = this.game.metrics.emissions;
          return (game) => game.metrics.emissions <= startingValue - 5;
        },
        reward: {
          score: 200,
          resources: 250,
          happiness: 5
        }
      },
      {
        title: "Public Transport Revolution",
        description: "Implement public transport policies to reduce emissions",
        difficulty: "easy",
        checkCompletion: () => {
          return (game) => game.activeEffects.some(effect => 
            effect.name && effect.name.includes("transport"));
        },
        reward: {
          score: 75,
          happiness: 10
        }
      },
      {
        title: "Zero Carbon Industry",
        description: "Reduce industrial emissions while maintaining economic growth",
        difficulty: "hard",
        checkCompletion: () => {
          const startEmissions = this.game.metrics.emissions;
          const startResources = this.game.resources;
          return (game) => 
            game.metrics.emissions < startEmissions - 8 && 
            game.resources > startResources;
        },
        reward: {
          score: 300,
          resources: 400
        }
      },
      {
        title: "Reforestation Project",
        description: "Reduce deforestation rate to below 2%",
        difficulty: "medium",
        checkCompletion: () => {
          return (game) => game.metrics.deforestationRate < 2;
        },
        reward: {
          score: 150,
          happiness: 15
        }
      }
    ];
  }
  
  generateInitialMissions() {
    // Start with 3 missions of different difficulties
    const easyMission = this.getRandomMission('easy');
    const mediumMission = this.getRandomMission('medium');
    const hardMission = this.getRandomMission('hard');
    
    if (easyMission) this.addMission(easyMission);
    if (mediumMission) this.addMission(mediumMission);
    if (hardMission) this.addMission(hardMission);
  }
  
  getRandomMission(difficulty = null) {
    // Filter by difficulty if specified
    let availableMissions = this.missionPool;
    if (difficulty) {
      availableMissions = availableMissions.filter(m => m.difficulty === difficulty);
    }
    
    // Remove missions that are already active or completed
    const activeIds = this.activeMissions.map(m => m.title);
    const completedIds = this.completedMissions.map(m => m.title);
    availableMissions = availableMissions.filter(m => 
      !activeIds.includes(m.title) && !completedIds.includes(m.title)
    );
    
    if (availableMissions.length === 0) return null;
    
    // Return a random mission
    const randomIndex = Math.floor(Math.random() * availableMissions.length);
    return availableMissions[randomIndex];
  }
  
  addMission(missionTemplate) {
    const missionId = this.missionIdCounter++;
    
    // Create a new mission instance
    const mission = {
      ...missionTemplate,
      id: missionId,
      isComplete: false,
      checkFn: missionTemplate.checkCompletion()
    };
    
    this.activeMissions.push(mission);
    return missionId;
  }
  
  updateMissions() {
    // Check if any missions are complete
    this.activeMissions.forEach(mission => {
      if (!mission.isComplete && mission.checkFn(this.game)) {
        mission.isComplete = true;
      }
    });
    
    // Add new missions periodically
    if (this.game.currentYear % 5 === 0) {
      const newMission = this.getRandomMission();
      if (newMission) {
        this.addMission(newMission);
      }
    }
  }
  
  completeMission(missionId) {
    const missionIndex = this.activeMissions.findIndex(m => m.id == missionId);
    if (missionIndex === -1) return null;
    
    const mission = this.activeMissions[missionIndex];
    if (!mission.isComplete) return null;
    
    // Remove from active and add to completed
    this.activeMissions.splice(missionIndex, 1);
    this.completedMissions.push(mission);
    
    return mission.reward;
  }
}

// Policy definitions
const policies = {
  renewable_investment: {
    name: "Renewable Energy Investment",
    description: "Invest in solar, wind, and hydroelectric power",
    cost: 200,
    immediate: {
      renewablePercentage: 5
    },
    effects: [{
      name: "renewable_subsidy",
      duration: 10,
      annual: {
        renewablePercentage: 1,
        emissions: -1
      }
    }]
  },
  carbon_tax: {
    name: "Carbon Tax",
    description: "Implement a tax on carbon emissions",
    cost: 100,
    immediate: {
      happiness: -10
    },
    effects: [{
      name: "carbon_pricing",
      duration: 999, // Effectively permanent
      annual: {
        emissions: -2,
        resources: 50
      }
    }]
  },
  public_transport: {
    name: "Public Transport Initiative",
    description: "Invest in buses, trains, and bike lanes",
    cost: 150,
    immediate: {
      happiness: 5
    },
    effects: [{
      name: "improved_transport",
      duration: 20,
      annual: {
        emissions: -1.5,
        happiness: 1
      }
    }]
  },
  reforestation: {
    name: "Reforestation Program",
    description: "Plant millions of trees to absorb CO2",
    cost: 180,
    immediate: {
      deforestationRate: -2
    },
    effects: [{
      name: "carbon_sink",
      duration: 30,
      annual: {
        emissions: -1,
        happiness: 1
      }
    }]
  },
  research: {
    name: "Climate Research",
    description: "Fund research into new climate technologies",
    cost: 300,
    immediate: {},
    effects: [{
      name: "research_breakthroughs",
      duration: 15,
      annual: {
        renewablePercentage: 1.5,
        emissions: -0.5
      }
    }]
  }
};

// Game initialization function
function initGame() {
  const game = new Game();
  game.initialize();
  
  // Set up event handlers
  document.getElementById('next-year').addEventListener('click', () => {
    game.advanceYear();
  });
  
  document.querySelectorAll('.policy-button').forEach(button => {
    button.addEventListener('click', (e) => {
      const policyId = e.target.getAttribute('data-policy');
      if (policyId && policies[policyId]) {
        const success = game.implementPolicy(policies[policyId]);
        if (success) {
          showNotification(`${policies[policyId].name} implemented!`);
          game.updateUI();
        } else {
          showNotification("Not enough resources!", "error");
        }
      }
    });
  });
  
  return game;
}

function showNotification(message, type = 'info') {
  const notificationArea = document.getElementById('notification-area');
  const notification = document.createElement('div');
  notification.classList.add('notification', type);
  notification.textContent = message;
  
  notificationArea.appendChild(notification);
  
  // Remove after 3 seconds
  setTimeout(() => {
    notification.classList.add('fade-out');
    setTimeout(() => notification.remove(), 500);
  }, 3000);
}

// Start the game when DOM is loaded
document.addEventListener('DOMContentLoaded', initGame);