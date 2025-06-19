// Classe pour gérer l'algorithme de répétition espacée
class SpacedRepetition {
    constructor() {
        this.cards = this.loadCards();
        
        // Ajouter des exemples si c'est la première utilisation
        if (this.cards.length === 0) {
            this.cards = this.getExampleCards();
            this.saveCards();
        }
        
        this.stats = this.loadStats();
        this.currentCard = null;
        this.reviewQueue = [];
        this.editingCardId = null;
        
        this.initializeApp();
    }

    // Exemples de cartes pour démarrer
    getExampleCards() {
        return [
            {
                id: Date.now() + 1,
                wordFr: "Bonjour",
                wordAr: "السلام عليكم",
                example: "السلام عليكم، كيف حالك؟ - Bonjour, comment vas-tu ?",
                arabicClassic: "مرحبا",
                createdAt: new Date()
            },
            {
                id: Date.now() + 2,
                wordFr: "Merci",
                wordAr: "شكرا",
                example: "شكرا بزاف - Merci beaucoup",
                arabicClassic: "شكرا لك",
                createdAt: new Date()
            },
            {
                id: Date.now() + 3,
                wordFr: "Pain",
                wordAr: "خبز",
                example: "بغيت شوية ديال الخبز - Je veux un peu de pain",
                arabicClassic: "خبز",
                createdAt: new Date()
            },
            {
                id: Date.now() + 4,
                wordFr: "Eau",
                wordAr: "ما",
                example: "عطيني كاس ديال الما - Donne-moi un verre d'eau",
                arabicClassic: "ماء",
                createdAt: new Date()
            },
            {
                id: Date.now() + 5,
                wordFr: "Maison",
                wordAr: "دار",
                example: "غادي نمشي للدار - Je vais rentrer à la maison",
                arabicClassic: "بيت / منزل",
                createdAt: new Date()
            },
            {
                id: Date.now() + 6,
                wordFr: "Comment",
                wordAr: "كيفاش",
                example: "كيفاش غادي نمشيو؟ - Comment allons-nous y aller ?",
                arabicClassic: "كيف",
                createdAt: new Date()
            },
            {
                id: Date.now() + 7,
                wordFr: "Maintenant",
                wordAr: "دابا",
                example: "خاصني نمشي دابا - Je dois partir maintenant",
                arabicClassic: "الآن",
                createdAt: new Date()
            },
            {
                id: Date.now() + 8,
                wordFr: "Demain",
                wordAr: "غدا",
                example: "نشوفوك غدا إن شاء الله - On se voit demain si Dieu le veut",
                arabicClassic: "غدا",
                createdAt: new Date()
            },
            {
                id: Date.now() + 9,
                wordFr: "Ami",
                wordAr: "صاحب",
                example: "هذا صاحبي - C'est mon ami",
                arabicClassic: "صديق",
                createdAt: new Date()
            },
            {
                id: Date.now() + 10,
                wordFr: "Argent",
                wordAr: "فلوس",
                example: "ما عنديش الفلوس - Je n'ai pas d'argent",
                arabicClassic: "مال / نقود",
                createdAt: new Date()
            },
            {
                id: Date.now() + 11,
                wordFr: "Travail",
                wordAr: "خدمة",
                example: "غادي للخدمة - Je vais au travail",
                arabicClassic: "عمل",
                createdAt: new Date()
            },
            {
                id: Date.now() + 12,
                wordFr: "Manger",
                wordAr: "كلا",
                example: "بغيت ناكل شي حاجة - Je veux manger quelque chose",
                arabicClassic: "أكل",
                createdAt: new Date()
            },
            {
                id: Date.now() + 13,
                wordFr: "Dormir",
                wordAr: "نعس",
                example: "بغيت ننعس شوية - Je veux dormir un peu",
                arabicClassic: "نام",
                createdAt: new Date()
            },
            {
                id: Date.now() + 14,
                wordFr: "Grand",
                wordAr: "كبير",
                example: "هاد الدار كبيرة بزاف - Cette maison est très grande",
                arabicClassic: "كبير",
                createdAt: new Date()
            },
            {
                id: Date.now() + 15,
                wordFr: "Petit",
                wordAr: "صغير",
                example: "عندي واحد الكلب صغير - J'ai un petit chien",
                arabicClassic: "صغير",
                createdAt: new Date()
            }
        ];
    }

    // Initialisation de l'application
    initializeApp() {
        this.setupEventListeners();
        this.updateReviewQueue();
        this.updateStats();
        this.renderCardsList();
    }

    // Configuration des écouteurs d'événements
    setupEventListeners() {
        // Navigation
        document.querySelectorAll('.nav-btn').forEach(btn => {
            btn.addEventListener('click', (e) => this.switchSection(e.target.dataset.section));
        });

        // Révision
        document.getElementById('start-btn').addEventListener('click', () => this.startReview());
        document.getElementById('flip-btn').addEventListener('click', () => this.flipCard());
        document.getElementById('flashcard').addEventListener('click', () => this.flipCard());

        // Évaluation
        document.querySelectorAll('.rating-btn').forEach(btn => {
            btn.addEventListener('click', (e) => this.rateCard(parseInt(e.target.dataset.rating)));
        });

        // Gestion des cartes
        document.getElementById('add-card-btn').addEventListener('click', () => this.openModal());
        document.getElementById('cancel-btn').addEventListener('click', () => this.closeModal());
        document.getElementById('card-form').addEventListener('submit', (e) => this.saveCard(e));
        document.getElementById('search').addEventListener('input', (e) => this.searchCards(e.target.value));

        // Import/Export
        document.getElementById('export-btn').addEventListener('click', () => this.exportData());
        document.getElementById('import-btn').addEventListener('click', () => {
            document.getElementById('import-file').click();
        });
        document.getElementById('import-file').addEventListener('change', (e) => this.importData(e));

        // Modal
        document.getElementById('modal').addEventListener('click', (e) => {
            if (e.target.id === 'modal') this.closeModal();
        });
    }

    // Changement de section
    switchSection(sectionName) {
        document.querySelectorAll('.nav-btn').forEach(btn => btn.classList.remove('active'));
        document.querySelectorAll('.section').forEach(section => section.classList.remove('active'));
        
        document.querySelector(`[data-section="${sectionName}"]`).classList.add('active');
        document.getElementById(sectionName).classList.add('active');
    }

    // Algorithme de répétition espacée (simplifié)
    calculateNextReview(rating, card) {
        const now = new Date();
        const intervals = [1, 3, 7, 14, 30, 90]; // Jours
        
        if (!card.repetitions) card.repetitions = 0;
        if (!card.easeFactor) card.easeFactor = 2.5;

        if (rating === 1) {
            card.repetitions = 0;
            card.interval = 1;
        } else {
            if (card.repetitions === 0) {
                card.interval = 1;
            } else if (card.repetitions === 1) {
                card.interval = 3;
            } else {
                card.interval = Math.round(card.interval * card.easeFactor);
            }
            
            card.repetitions++;
            card.easeFactor = card.easeFactor + (0.1 - (4 - rating) * (0.08 + (4 - rating) * 0.02));
            card.easeFactor = Math.max(1.3, card.easeFactor);
        }

        card.nextReview = new Date(now.getTime() + card.interval * 24 * 60 * 60 * 1000);
        card.lastReviewed = now;
        
        return card;
    }

    // Mise à jour de la file de révision
    updateReviewQueue() {
        const now = new Date();
        this.reviewQueue = this.cards.filter(card => {
            if (!card.nextReview) return true;
            return new Date(card.nextReview) <= now;
        });
        
        document.getElementById('cards-remaining').textContent = this.reviewQueue.length;
    }

    // Démarrer la révision
    startReview() {
        if (this.reviewQueue.length === 0) {
            alert('Aucune carte à réviser pour le moment !');
            return;
        }

        this.currentCard = this.reviewQueue[0];
        this.showCard();
        
        document.getElementById('start-btn').classList.add('hidden');
        document.getElementById('flip-btn').classList.remove('hidden');
    }

    // Afficher la carte
    showCard() {
        document.getElementById('word-fr').textContent = this.currentCard.wordFr;
        document.querySelector('.front').classList.remove('hidden');
        document.querySelector('.back').classList.add('hidden');
        document.getElementById('rating-buttons').classList.add('hidden');
        document.getElementById('flip-btn').classList.remove('hidden');
    }

    // Retourner la carte
    flipCard() {
        if (!this.currentCard) return;

        document.querySelector('.front').classList.add('hidden');
        document.querySelector('.back').classList.remove('hidden');
        
        document.getElementById('word-ar').textContent = this.currentCard.wordAr;
        
        if (this.currentCard.example || this.currentCard.arabicClassic) {
            document.getElementById('extra-info').classList.remove('hidden');
            document.getElementById('example').textContent = this.currentCard.example || '';
            document.getElementById('arabic-classic').textContent = this.currentCard.arabicClassic || '';
        } else {
            document.getElementById('extra-info').classList.add('hidden');
        }
        
        document.getElementById('flip-btn').classList.add('hidden');
        document.getElementById('rating-buttons').classList.remove('hidden');
    }

    // Noter la carte
    rateCard(rating) {
        this.currentCard = this.calculateNextReview(rating, this.currentCard);
        this.saveCards();
        
        // Mise à jour des statistiques
        this.updateDailyStats(rating);
        
        // Retirer de la file
        this.reviewQueue.shift();
        this.updateReviewQueue();
        
        if (this.reviewQueue.length > 0) {
            this.currentCard = this.reviewQueue[0];
            this.showCard();
        } else {
            this.endReview();
        }
    }

    // Fin de la révision
    endReview() {
        document.getElementById('word-fr').textContent = 'Révision terminée !';
        document.querySelector('.front').classList.remove('hidden');
        document.querySelector('.back').classList.add('hidden');
        document.getElementById('rating-buttons').classList.add('hidden');
        document.getElementById('flip-btn').classList.add('hidden');
        document.getElementById('start-btn').classList.remove('hidden');
        document.getElementById('start-btn').textContent = 'Recommencer';
    }

    // Gestion des cartes
    openModal(cardId = null) {
        const modal = document.getElementById('modal');
        const form = document.getElementById('card-form');
        
        if (cardId) {
            const card = this.cards.find(c => c.id === cardId);
            if (card) {
                document.getElementById('modal-title').textContent = 'Modifier la carte';
                document.getElementById('word-fr-input').value = card.wordFr;
                document.getElementById('word-ar-input').value = card.wordAr;
                document.getElementById('example-input').value = card.example || '';
                document.getElementById('arabic-classic-input').value = card.arabicClassic || '';
                this.editingCardId = cardId;
            }
        } else {
            document.getElementById('modal-title').textContent = 'Ajouter une carte';
            form.reset();
            this.editingCardId = null;
        }
        
        modal.classList.remove('hidden');
    }

    closeModal() {
        document.getElementById('modal').classList.add('hidden');
        document.getElementById('card-form').reset();
        this.editingCardId = null;
    }

    saveCard(e) {
        e.preventDefault();
        
        const card = {
            id: this.editingCardId || Date.now(),
            wordFr: document.getElementById('word-fr-input').value,
            wordAr: document.getElementById('word-ar-input').value,
            example: document.getElementById('example-input').value,
            arabicClassic: document.getElementById('arabic-classic-input').value,
            createdAt: new Date()
        };

        if (this.editingCardId) {
            const index = this.cards.findIndex(c => c.id === this.editingCardId);
            if (index !== -1) {
                this.cards[index] = { ...this.cards[index], ...card };
            }
        } else {
            this.cards.push(card);
        }

        this.saveCards();
        this.renderCardsList();
        this.updateReviewQueue();
        this.closeModal();
    }

    deleteCard(cardId) {
        if (confirm('Êtes-vous sûr de vouloir supprimer cette carte ?')) {
            this.cards = this.cards.filter(c => c.id !== cardId);
            this.saveCards();
            this.renderCardsList();
            this.updateReviewQueue();
        }
    }

    renderCardsList() {
        const container = document.getElementById('cards-list');
        container.innerHTML = '';

        this.cards.forEach(card => {
            const cardElement = document.createElement('div');
            cardElement.className = 'card-item';
            cardElement.innerHTML = `
                <div class="card-item-content">
                    <strong>${card.wordFr}</strong> - <span class="arabic">${card.wordAr}</span>
                </div>
                <div class="card-item-actions">
                    <button class="edit-btn" onclick="app.openModal(${card.id})">Modifier</button>
                    <button class="delete-btn" onclick="app.deleteCard(${card.id})">Supprimer</button>
                </div>
            `;
            container.appendChild(cardElement);
        });
    }

    searchCards(query) {
        const filtered = this.cards.filter(card => 
            card.wordFr.toLowerCase().includes(query.toLowerCase()) ||
            card.wordAr.includes(query)
        );
        
        const container = document.getElementById('cards-list');
        container.innerHTML = '';
        
        filtered.forEach(card => {
            const cardElement = document.createElement('div');
            cardElement.className = 'card-item';
            cardElement.innerHTML = `
                <div class="card-item-content">
                    <strong>${card.wordFr}</strong> - <span class="arabic">${card.wordAr}</span>
                </div>
                <div class="card-item-actions">
                    <button class="edit-btn" onclick="app.openModal(${card.id})">Modifier</button>
                    <button class="delete-btn" onclick="app.deleteCard(${card.id})">Supprimer</button>
                </div>
            `;
            container.appendChild(cardElement);
        });
    }

    // Statistiques
    updateDailyStats(rating) {
        const today = new Date().toDateString();
        
        if (!this.stats.daily[today]) {
            this.stats.daily[today] = { reviewed: 0, correct: 0 };
        }
        
        this.stats.daily[today].reviewed++;
        if (rating >= 3) {
            this.stats.daily[today].correct++;
        }
        
        this.stats.lastReviewDate = today;
        this.saveStats();
        this.updateStats();
    }

    updateStats() {
        const today = new Date().toDateString();
        const todayStats = this.stats.daily[today] || { reviewed: 0, correct: 0 };
        
        document.getElementById('total-cards').textContent = this.cards.length;
        document.getElementById('reviewed-today').textContent = todayStats.reviewed;
        
        const successRate = todayStats.reviewed > 0 
            ? Math.round((todayStats.correct / todayStats.reviewed) * 100) 
            : 0;
        document.getElementById('success-rate').textContent = successRate + '%';
        
        document.getElementById('streak').textContent = this.calculateStreak();
    }

    calculateStreak() {
        let streak = 0;
        let currentDate = new Date();
        
        while (this.stats.daily[currentDate.toDateString()]) {
            streak++;
            currentDate.setDate(currentDate.getDate() - 1);
        }
        
        return streak;
    }

    // Sauvegarde et chargement
    saveCards() {
        localStorage.setItem('flashcards', JSON.stringify(this.cards));
    }

    loadCards() {
        const saved = localStorage.getItem('flashcards');
        return saved ? JSON.parse(saved) : [];
    }

    saveStats() {
        localStorage.setItem('stats', JSON.stringify(this.stats));
    }

    loadStats() {
        const saved = localStorage.getItem('stats');
        return saved ? JSON.parse(saved) : {
            daily: {},
            lastReviewDate: null
        };
    }

    // Export des données
    exportData() {
        const exportData = {
            version: '1.0',
            exportDate: new Date().toISOString(),
            cards: this.cards,
            stats: this.stats,
            metadata: {
                totalCards: this.cards.length,
                appName: 'Répétition Espacée - Arabe'
            }
        };

        const dataStr = JSON.stringify(exportData, null, 2);
        const dataBlob = new Blob([dataStr], { type: 'application/json' });
        
        const link = document.createElement('a');
        link.href = URL.createObjectURL(dataBlob);
        link.download = `flashcards-export-${new Date().toISOString().split('T')[0]}.json`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        
        alert(`Export réussi ! ${this.cards.length} cartes exportées.`);
    }

    // Import des données
    importData(event) {
        const file = event.target.files[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = (e) => {
            try {
                const importedData = JSON.parse(e.target.result);
                
                // Validation basique
                if (!importedData.version || !importedData.cards) {
                    throw new Error('Format de fichier invalide');
                }

                // Demander confirmation
                const confirmMessage = `Voulez-vous importer ${importedData.cards.length} cartes ?\n\n` +
                    `Ceci remplacera vos ${this.cards.length} cartes actuelles.\n` +
                    `Date d'export : ${new Date(importedData.exportDate).toLocaleDateString()}`;
                
                if (confirm(confirmMessage)) {
                    // Import des cartes
                    this.cards = importedData.cards.map(card => ({
                        ...card,
                        nextReview: card.nextReview ? new Date(card.nextReview) : null,
                        lastReviewed: card.lastReviewed ? new Date(card.lastReviewed) : null,
                        createdAt: card.createdAt ? new Date(card.createdAt) : new Date()
                    }));
                    
                    // Import des statistiques si disponibles
                    if (importedData.stats) {
                        this.stats = importedData.stats;
                    }
                    
                    // Sauvegarder et rafraîchir
                    this.saveCards();
                    this.saveStats();
                    this.renderCardsList();
                    this.updateReviewQueue();
                    this.updateStats();
                    
                    alert('Import réussi !');
                }
            } catch (error) {
                alert('Erreur lors de l\'import : ' + error.message);
            }
            
            // Réinitialiser l'input file
            event.target.value = '';
        };
        
        reader.readAsText(file);
    }
}

// Initialisation de l'application
const app = new SpacedRepetition();
