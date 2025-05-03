import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import '@fortawesome/fontawesome-free/css/all.min.css';
import '../css/Settings.css';

function Settings() {
  const navigate = useNavigate();
  
  const defaultSettings = {
    time: 300,
    bleu: 'Phonk',
    rouge: 'Techno',
    scoreBleu: 1,
    scoreRouge: 1,
  };

  const [settings, setSettings] = useState({
    time: localStorage.getItem('config-time') || defaultSettings.time,
    bleu: localStorage.getItem('config-bleu') || defaultSettings.bleu,
    rouge: localStorage.getItem('config-rouge') || defaultSettings.rouge,
    scoreBleu: parseFloat(localStorage.getItem('config-scoreBleu')) || defaultSettings.scoreBleu,
    scoreRouge: parseFloat(localStorage.getItem('config-scoreRouge')) || defaultSettings.scoreRouge,
  });

  const [errors, setErrors] = useState({
    bleu: '',
    rouge: ''
  });

  const [giftListOpen, setGiftListOpen] = useState(false);
  const [giftIcons, setGiftIcons] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [checkedGifts, setCheckedGifts] = useState({});


  // Fonction pour récupérer les icônes depuis l'API
  // Charger les configurations précédentes des cases cochées
  useEffect(() => {
    const savedBlueGifts = JSON.parse(localStorage.getItem('selectedBlueGifts')) || [];
    const savedRedGifts = JSON.parse(localStorage.getItem('selectedRedGifts')) || [];
    
    const initialCheckedGifts = {};
    savedBlueGifts.forEach(id => {
      initialCheckedGifts[id] = { blue: true, red: false };
    });
    savedRedGifts.forEach(id => {
      initialCheckedGifts[id] = { blue: false, red: true };
    });
    
    setCheckedGifts(initialCheckedGifts);
  }, []);

  useEffect(() => {
    axios.get('http://localhost:3002/giftall')
      .then(response => {
        setGiftIcons(response.data);
      })
      .catch(error => {
        console.error('Erreur de récupération des icônes:', error);
        alert("Erreur lors du chargement des icônes.");
      });
  }, []);


  // Fonction pour gérer le changement d'état des cases à cocher
  const handleGiftCheckboxChange = (giftId, checkboxType) => {
    setCheckedGifts(prevCheckedGifts => {
      const newCheckedGifts = { ...prevCheckedGifts };
      if (checkboxType === 'blue') {
        newCheckedGifts[giftId] = { blue: !newCheckedGifts[giftId]?.blue, red: false };
      } else if (checkboxType === 'red') {
        newCheckedGifts[giftId] = { blue: false, red: !newCheckedGifts[giftId]?.red };
      }
      return newCheckedGifts;
    });
  };


  const handleChange = (e) => {
    const { name, value } = e.target;
    setSettings({ ...settings, [name]: value });
    if (name === 'bleu' && value.length > 9) {
      setErrors(prevErrors => ({ ...prevErrors, bleu: 'Le nom bleu ne doit pas dépasser 11 caractères.' }));
    } else if (name === 'bleu') {
      setErrors(prevErrors => ({ ...prevErrors, bleu: '' }));
    }
    if (name === 'rouge' && value.length > 9) {
      setErrors(prevErrors => ({ ...prevErrors, rouge: 'Le nom rouge ne doit pas dépasser 11 caractères.' }));
    } else if (name === 'rouge') {
      setErrors(prevErrors => ({ ...prevErrors, rouge: '' }));
    }
  };

  const handleSaveAndGoBack = () => {
    if (errors.bleu || errors.rouge) {
      alert('Corrigez les erreurs avant de sauvegarder.');
      return;
    }
  
    localStorage.setItem('config-time', settings.time);
    localStorage.setItem('config-bleu', settings.bleu);
    localStorage.setItem('config-rouge', settings.rouge);
    localStorage.setItem('config-scoreBleu', settings.scoreBleu);
    localStorage.setItem('config-scoreRouge', settings.scoreRouge);
  
    // Filtrage des IDs des cadeaux sélectionnés pour chaque équipe
    const selectedBlueGifts = Object.keys(checkedGifts).filter(
      (giftId) => checkedGifts[giftId]?.blue
    );
    const selectedRedGifts = Object.keys(checkedGifts).filter(
      (giftId) => checkedGifts[giftId]?.red
    );
  
    // Sauvegarde des IDs sélectionnés dans le localStorage
    localStorage.setItem('selectedBlueGifts', JSON.stringify(selectedBlueGifts));
    localStorage.setItem('selectedRedGifts', JSON.stringify(selectedRedGifts));
  
    alert('Paramètres enregistrés avec succès!');
    navigate('/game');
  };
  

  return (
    <div className="settings-container">
      <div className="form-wrapper">
        <h1>Paramètres de Configuration</h1>
        <label>
          Temps (secondes) :
          <input
            type="number"
            name="time"
            value={settings.time}
            onChange={handleChange}
          />
        </label>
        <br />
        <div className="team-input">
          <label>
            Nom (bleu) :
            <input
              type="text"
              name="bleu"
              value={settings.bleu}
              onChange={handleChange}
            />
          </label>
          <label>
            Score :
            <input
              type="number"
              name="scoreBleu"
              value={settings.scoreBleu}
              onChange={handleChange}
              className="score-input"
            />
          </label>
        </div>
        {errors.bleu && <p className="error-message">{errors.bleu}</p>}

        <div className="team-input">
          <label>
            Nom (rouge) :
            <input
              type="text"
              name="rouge"
              value={settings.rouge}
              onChange={handleChange}
            />
          </label>
          <label>
            Score :
            <input
              type="number"
              name="scoreRouge"
              value={settings.scoreRouge}
              onChange={handleChange}
              className="score-input"
            />
          </label>
        </div>
        {errors.rouge && <p className="error-message">{errors.rouge}</p>}

        {/* Onglet Gift List avec icône Font Awesome */}
        <div className={`gift-list-tab ${giftListOpen ? "open" : ""}`}>
          <h3 onClick={() => setGiftListOpen(!giftListOpen)}>
            🎁 Gift List{" "}
            <i className={`fas ${giftListOpen ? "fa-chevron-up" : "fa-chevron-down"}`}></i>
          </h3>
          {giftListOpen && (
            <div className="gift-list-content">
              {/* Barre de recherche dans l'onglet Gift List */}
              <div className="search-container">
                <input
                  type="text"
                  placeholder="Rechercher un cadeau..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)} // Met à jour la valeur de la recherche
                  className="search-input"
                />
              </div>
              {giftIcons.length > 0 ? (
              <div className="gift-icons">
                {giftIcons
                  .filter((gift) =>
                    gift.nom.toLowerCase().includes(searchQuery.toLowerCase()) // Filtre selon la recherche
                  )
                  .map((gift) => (
                    <div key={gift.id} className="gift-item">
                      <img src={gift.imageUrl} alt={gift.nom} width="50" height="50" />
                      <p>{gift.nom}</p>
                      <div className="gift-price">

                        {gift.prix}
                                                <img
                          src="https://cdn3d.iconscout.com/3d/free/thumb/free-tiktok-coin-7455382-6220601.png"
                          alt="Coin Icon"
                          width="20"  // Taille de l'icône de la pièce
                          height="20" // Taille de l'icône de la pièce
                          style={{ marginRight: '5px' }}  // Espacement entre l'icône et le texte
                        />
                      </div>
                      <div className="checkbox-container">
                        <label
                          className={`checkbox-label ${checkedGifts[gift.id]?.blue ? 'blue' : ''}`}
                        >
                          <input
                            type="checkbox"
                            checked={checkedGifts[gift.id]?.blue || false}
                            onChange={() => handleGiftCheckboxChange(gift.id, 'blue')}
                          />
                          <span className="checkmark">{checkedGifts[gift.id]?.blue ? '' : ''}</span>
                        </label>
                        <label
                          className={`checkbox-label ${checkedGifts[gift.id]?.red ? 'red' : ''}`}
                        >
                          <input
                            type="checkbox"
                            checked={checkedGifts[gift.id]?.red || false}
                            onChange={() => handleGiftCheckboxChange(gift.id, 'red')}
                          />
                          <span className="checkmark">{checkedGifts[gift.id]?.red ? '' : ''}</span>
                        </label>
                      </div>
                    </div>
                  ))}
              </div>
            ) : (
              <p>Chargement des icônes...</p>
            )}
            </div>
          )}
        </div>

        <br />
        <br />
        <br />
        <button className="save-button" onClick={handleSaveAndGoBack}>
          Enregistrer et Retourner au Jeu
        </button>
      </div>
    </div>
  );
}

export default Settings;