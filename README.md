# HDM Todo List

## Fonctionnalités implémentées dans le backend
- **Création d'une tâche**
  - On peut créer une tâche en effectuant une requête POST à l'adresse `/tasks` avec le nom de la tâche dans le corp de la requête.
- **Modification d'une tâche**
  - On peut modifier une tâche existante en effectuant une requête PATCH à l'adresse `/tasks/:id` en remplaçant `:id` par l'identifiant de la tâche à supprimer, avec le nouveau nom de la tâche dans le corp de la requête.
  - Si on essaye de modifier une tâche qui n'existe pas, une erreur 404 est retourné.
  
## Fonctionnalités implémentées dans le frontend
- **Création d'une tâche**
  - En cliquant sur le bouton `AJOUTER UNE TÂCHE`, une nouvelle tâche est créer avec le nom par défaut `Nouvelle Tâche`.
- **Modification d'une tâche**
  - En modifiant le nom d'une tâche puis en cliquant sur le bouton avec la coche verte, le nom de la tâche est modifié.
  - Si le nom de la tâche n'est pas modifié ou vide, le bouton pour valider est désactivé.
- **Suppression d'une tâche**
  - On peut supprimer une tâche en cliquant sur le bouton avec l’icône de poubelle.

## Décisions et choix techniques

### **Utilisation de `useState` pour les modifications locales (`taskEdits`)**

- **Pourquoi :**
  
  L'état `taskEdits` permet de gérer les noms des tâches modifiés localement sans impacter directement la liste principale des tâches.
  Cela facilite la comparaison entre la version modifiée et la version originale pour activer ou désactiver le bouton de sauvegarde.

- **Structure :**

  `taskEdits` est un objet dont les clés sont les identifiants (`id`) des tâches, et les valeurs sont leurs noms modifiés.

- **Exemple :**
  ```typescript
  {
    1: "Tâche modifiée",
    2: "Une autre tâche modifiée"
  }
  ```

### **Validation avant sauvegarde**

- **Pourquoi :**
  
  Éviter des appels API inutiles lorsque le nom d'une tâche n'a pas été modifié.

- **Comment :**

  Le bouton de validation (`Check`) est désactivé si :
  - Le champ de texte est vide.
  - Le nom n'a pas été modifié.

  Vérification :
   ```
   disabled={!(taskEdits[task.id]?.trim() && taskEdits[task.id]?.trim() !== task.name)}
   ```

### **Rafraîchissement des tâches après chaque action**
   - **Pourquoi :**
     - Les données doivent rester synchronisées avec le backend après chaque suppression, ajout ou mise à jour.
   - **Comment :**
     - Utilisation d'une méthode commune pour récupérer toutes les tâches après chaque action :
       ```typescript
       const handleFetchTasks = async () => setTasks(await api.get('/tasks'));
       ```

### 4. **Ajout de nouvelles tâches**
   - **Pourquoi :**
     - Permettre à l'utilisateur d'ajouter une tâche avec un nom par défaut (`Nouvelle tâche`).
   - **Comment :**
     - Envoi d'une requête `POST` :
       ```typescript
       await api.post('/tasks', { name: 'Nouvelle tâche' });
       await handleFetchTasks();
       ```