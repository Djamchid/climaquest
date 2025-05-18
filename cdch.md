# Cahier des Charges : ClimaQuest - Le Jeu des Gardiens du Climat

## 1. Concept du jeu

**ClimaQuest** est un jeu de stratégie et de gestion de ressources basé sur les missions des Gardiens du Climat pour la période 2025-2045. Le joueur incarne un Gardien du Climat qui doit relever des défis environnementaux majeurs en sélectionnant judicieusement les défis à adresser et en allouant efficacement des ressources limitées.

## 2. Objectifs pédagogiques

- Sensibiliser aux défis climatiques des prochaines décennies
- Développer une pensée stratégique face aux problématiques environnementales
- Comprendre les compromis et contraintes budgétaires dans la lutte contre le changement climatique
- Familiariser avec les technologies et solutions potentielles face aux crises environnementales

## 3. Mécanique de jeu

### 3.1 Structure générale

1. Le jeu se déroule sur 8 tours potentiels (un par mission)
2. À chaque tour, le joueur dispose d'un budget exprimé en milliards d'euros (Md€)
3. Le budget initial est de 100 Md€ pour la première mission
4. Le budget évolue entre les missions en fonction des performances du joueur

### 3.2 Déroulement d'un tour de jeu

1. **Sélection de mission** : Le joueur choisit une des 8 missions disponibles
2. **Présentation du contexte** : Le contexte de la mission est présenté au joueur
3. **Identification des défis** : Une liste mélangée de tous les défis (32 au total, 4 par mission) est présentée, le joueur doit sélectionner ceux qu'il pense appartenir à sa mission
4. **Allocation des ressources** : Une liste complète des ressources disponibles (32 au total, 4 par mission) est présentée avec leurs coûts respectifs, le joueur doit sélectionner les ressources qu'il souhaite utiliser dans la limite de son budget
5. **Évaluation** : Le système évalue les choix du joueur et attribue une note sur 100
6. **Ajustement du budget** : Le budget pour la mission suivante est ajusté selon la performance

## 4. Détails techniques

### 4.1 Base de données du jeu

#### 4.1.1 Missions

Le jeu comprend 8 missions:
1. Catastrophe en Asie du Sud-Est (2025)
2. Crise agricole européenne (2030)
3. La crise des réfugiés climatiques (2035)
4. Révolution de l'agriculture verticale (2037)
5. Transformation du transport mondial (2039)
6. L'ère de la captation carbone (2041)
7. Résilience urbaine extrême (2043)
8. L'alliance climat-biodiversité (2045)

#### 4.1.2 Défis et ressources par mission

Chaque mission possède 4 défis spécifiques et 4 ressources disponibles, comme détaillé dans le document source.

### 4.2 Attribution des coûts des ressources

Les ressources ont des coûts variables selon leur nature et leur importance:

| Type de ressource | Coût (Md€) |
|-------------------|------------|
| Équipements d'urgence et secours | 10-25 |
| Technologies avancées | 20-40 |
| Systèmes d'IA et données | 15-35 |
| Infrastructures | 30-60 |
| Fonds et financements | 25-45 |
| Réseaux et alliances | 15-30 |
| Recherche et innovation | 20-50 |

### 4.3 Système de notation

La note sur 100 est calculée selon la formule:

**Note = (Justesse des défis × 0.4) + (Pertinence des ressources × 0.6)**

Où:
- **Justesse des défis** = Pourcentage de défis correctement identifiés
- **Pertinence des ressources** = Adéquation entre les ressources choisies et les défis réels de la mission

### 4.4 Ajustement du budget

- Note supérieure à 85: Budget augmenté de 25%
- Note entre 70 et 85: Budget augmenté de 15%
- Note entre 55 et 69: Budget augmenté de 5%
- Note entre 40 et 54: Budget réduit de 5%
- Note entre 25 et 39: Budget réduit de 15%
- Note inférieure à 25: Budget réduit de 25%

## 5. Interface utilisateur

### 5.1 Écran d'accueil
- Titre du jeu et ambiance visuelle climatique
- Bouton "Nouvelle partie"
- Bouton "Règles du jeu"
- Bouton "À propos" (informations pédagogiques)

### 5.2 Sélection de mission
- Présentation visuelle des 8 missions avec une image représentative
- Date de la mission
- Titre accrocheur
- Bouton de sélection

### 5.3 Écran de contexte
- Texte descriptif du contexte de la mission
- Visualisation d'un planisphère indiquant la région concernée
- Statistiques clés relatives à la mission (température globale, niveau de la mer, etc.)
- Bouton "Commencer la mission"

### 5.4 Écran de sélection des défis
- Liste mélangée des 32 défis sous forme de cartes
- Possibilité de filtrer par catégorie (urgence, technologique, social, etc.)
- Compteur de sélection (4 défis à sélectionner)
- Bouton "Valider ma sélection"

### 5.5 Écran d'allocation des ressources
- Affichage du budget disponible
- Liste des ressources avec coût et description succincte
- Visualisation du budget restant qui se met à jour avec chaque sélection
- Bouton "Finaliser ma mission"

### 5.6 Écran de résultats
- Note sur 100 avec animation
- Feedback détaillé sur les choix (défis corrects/incorrects, pertinence des ressources)
- Information sur le budget de la prochaine mission
- Bouton "Mission suivante" ou "Fin de partie" si dernière mission

## 6. Spécifications techniques

### 6.1 Plateforme
- Application web responsive
- Compatible PC, tablettes et smartphones
- Navigateurs supportés: Chrome, Firefox, Safari, Edge (versions récentes)

### 6.2 Technologies recommandées
- Frontend: HTML5, CSS3, JavaScript (framework React ou Vue.js)
- Backend: Node.js ou Python (Django/Flask)
- Base de données: MongoDB ou PostgreSQL
- Stockage des données de jeu: LocalStorage ou compte utilisateur

### 6.3 Performance
- Temps de chargement initial < 3 secondes
- Réactivité de l'interface < 200ms pour les interactions
- Sauvegarde automatique de la progression

## 7. Évolutions futures potentielles

- Mode multijoueur coopératif
- Scénarios additionnels basés sur des projections climatiques actualisées
- Personnalisation du Gardien du Climat
- Mode "expert" avec plus de variables et de complexité
- Intégration de données climatiques réelles en temps réel

## 8. Annexes

### 8.1 Liste détaillée des défis par mission

[Liste complète des 32 défis extraits du document source]

### 8.2 Liste détaillée des ressources et leurs coûts

[Liste complète des 32 ressources avec les coûts attribués]

### 8.3 Algorithme détaillé de notation

[Description technique de l'algorithme de notation]

### 8.4 Références scientifiques

[Sources scientifiques soutenant les scénarios du jeu]

---

Ce cahier des charges constitue la base pour le développement du jeu ClimaQuest. Des ajustements pourront être apportés durant le développement pour optimiser l'expérience utilisateur et la valeur pédagogique du jeu.
