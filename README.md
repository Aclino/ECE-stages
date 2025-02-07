# 🌐 Projet Plateforme d'Évaluation des Compétences
Ce projet vise à développer un **site web** pour l'**ECE**, permettant d'évaluer les compétences des élèves à travers des exercices interactifs.

---
## Table des Matières

1. [🎯 Objectifs](#-objectifs)
2. [📝 Exercices types](#-exercices-types)
3. [📈 Progression des Étudiants](#-progression-des-étudiants)
4. [🚀 Technologies Utilisées](#-technologies-utilisées)
5. [📝 Comment Contribuer](#-comment-contribuer)
6. [📧 Contact](#-contact)

## 🎯 Objectifs

- Permettre aux **professeurs** d'ajouter des **matières**, **chapitres**, **compétences** et **exercices**.  
- Suivre la **progression des élèves** en fonction de leurs réponses.  
- Offrir une interface intuitive et accessible pour les élèves et enseignants.  

---

## 📝 Exercices types

- Question à choix unique (QCU)  
- Question à choix multiples (QCM)  
- Question ouverte

## 📈 Progression des Étudiants

- Chaque réponse influence la progression de l'élève. (Valider)  
- Une visualisation permet de voir les compétences acquises et celles à améliorer. (Valider) 

---

## 🚀 Technologies Utilisées

- **Frontend** : Vue.js
- **Backend** : Node.js
- **Base de données** : PostgreSQL
- **Outil de gestion de projet** : GitHub

---
## 📈 Fonctionnalités Valider (acces dans index.js mis entre prarenthese)

- page login('/login')
   - marche intégralement
- page register('/register')
   - marche intégralement
- Menu déroulant ('/')
   - Affichage des matieres,chapitres et competence qui sont lieé ensemble de base de donnée.
   - Affichage de la progression pour les competences et chapitres
   - Possibilité d'acceder directement aux exercices de la competence du chapitre de la matiere que l'on veut.
   - possibilité de realiser 20 question aleatoirement 
- Sécurisation par token web du site entier
- Page exercice
   - sauvegarde des tentatives
   - verification des reponses des propositions

## 📈 Fonctionnalités a Ajouter (acces dans index.js mis entre prarenthese)

- Menu déroulant ('/')
   - Affichage des pages profs pour les profs
- Page exercice
   - -une barre de progression pour les compétences qui s’affiche sur page exo qui dépend de la réussite d’un certains nombre de questions fixer par le prof
=Rêquete SQL qui va sélectionner tout les enregistrements de la table tentative qui ont id_question=id_question au quel on répond et l'id_utilisateur=id dans le token dans tentative et le booléen est_correcte= vraie dans la table proposition qui sont relier par la table tentative_assignement par l’id_tentative et où l’id_question dans la table proposition qui sont relié à la table tentative_assignement par l’id_proposition correspond bien à celui de la question traiter et dont l’id_competence dans la table question qui est rélier par id_question correspond à la compétence que l’on évalue.

## 📝 Comment Contribuer

**Clonez le dépôt** :  
   ```bash
   git clone https://github.com/Aclino/ECE-stages.git
   ```

---

## 📧 Contact

Pour toute question ou suggestion, veuillez contacter l’un des membres de l’équipe du projet :

- Noah NICOLA : [noah.nicola@edu.ece.fr](mailto:noah.nicola@edu.ece.fr)  [@Aclino](https://github.com/Aclino) 
- Oscar BOSSELUT : [oscar.bosselut@edu.ece.fr](mailto:oscar.bosselut@edu.ece.fr) [@oscarbslt](https://github.com/oscarbslt)
- Alban DECHIROT : [alban.dechirot@edu.ece.fr](mailto:alban.dechirot@edu.ece.fr) [@Alban121](https://github.com/Alban121)
- Thibaud BELLATON : [thibaud.bellaton@edu.ece.fr](mailto:thibaud.bellaton@edu.ece.fr)  [@thibaud-bltn](https://github.com/thibaud-bltn)
- Ismael SAID ISMAIL : [ismael.saidismail@edu.ece.fr](mailto:ismael.saidismail@edu.ece.fr)
- Mahouna HESSOU : [mahouna.hessou@edu.ece.fr](mailto:mahouna.hessou@edu.ece.fr)

---

Merci de votre intérêt pour notre projet ! 🌐
