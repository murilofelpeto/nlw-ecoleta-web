import React, {useEffect, useState, ChangeEvent, FormEvent} from 'react';
import logo from '../../assets/logo.svg'
import {FiArrowLeft} from "react-icons/fi";
import {Link, useHistory} from 'react-router-dom'
import {Map, TileLayer, Marker} from 'react-leaflet';
import {LeafletMouseEvent} from 'leaflet'
import {api, ibge} from '../../services/api';
import Dropzone from "../../components/dropzone";
import './styles.css';

//We use useEffect to call api just once, and not every time our function reload
//Every time we create a state for an Array or an object we need inform the variable type, so we create an Interface for this
//When we iterate over an array we need to set a key value for React map all elements correctly
interface Item {
    id: number;
    title: string;
    image_url: string;
}

interface State {
    id: number;
    sigla: string;
}

interface City {
    id: number;
    nome: string;
}

const CreatePoint = () => {
    const history = useHistory();

    const [items, setItems] = useState<Array<Item>>([]);

    const [states, setStates] = useState<Array<State>>([]);
    const [selectedUF, setSelectedUF] = useState("0");

    const [cities, setCities] = useState<Array<City>>([]);
    const [selectedCity, setSelectedCity] = useState("0");

    const [selectedPosition, setSelectedPosition] = useState<[number, number]>([0,0]);
    const [currentPosition, setCurrentPosition] = useState<[number, number]>([0,0]);

    const [selectedItems, setSelectedItems] = useState<Array<number>>([])
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        whatsapp: '',
    });

    const[selectedFile, setSelectedFile] = useState<File>();

    useEffect(() => {
        api.get('items').then(resp => {
            setItems(resp.data);
        });
    }, []);

    useEffect(() => {
        ibge.get('estados', {params:{orderBy:'nome'}}).then(resp => {
            setStates(resp.data);
        })
    }, []);

    useEffect(() => {
        if(selectedUF === '0') {
            return;
        }
        ibge.get(`estados/${selectedUF}/municipios`, {params:{orderBy:'nome'}}).then(resp => {
            setCities(resp.data);
        })
    }, [selectedUF]);

    useEffect(() => {
        navigator.geolocation.getCurrentPosition(position => {
            const {latitude, longitude} = position.coords;
            setCurrentPosition([latitude, longitude]);
        })

    }, [])

    function handleUfChange(event: ChangeEvent<HTMLSelectElement>) {
        setSelectedUF(event.target.value);
    }

    function handleCityChange(event: ChangeEvent<HTMLSelectElement>) {
        setSelectedCity(event.target.value);
    }

    function handleMapLocalization(event: LeafletMouseEvent) {
        setSelectedPosition([event.latlng.lat, event.latlng.lng]);
    }

    function handleInputChange(event: ChangeEvent<HTMLInputElement>) {
        const {name, value} = event.target;
        setFormData({
            ...formData,
            [name]: value
        });
    }
    
    function handleSelectItem(id: number) {
        const alreadySelected = selectedItems.findIndex(item => item === id);
        if (alreadySelected >= 0) {
            const filteredItems = selectedItems.filter(item => item !== id);
            setSelectedItems(filteredItems)
        } else {
            setSelectedItems(
                [...selectedItems, id]
            );
        }
    }

    async function handleSubmit(event: FormEvent) {
        event.preventDefault();

        const {name, email, whatsapp} = formData;
        const uf = selectedUF;
        const city = selectedCity;
        const [latitude, longitude] = selectedPosition;
        const items = selectedItems;
        const image = selectedFile;

        const payload = new FormData();

        payload.append('name', name);
        payload.append('email', email);
        payload.append('whatsapp', whatsapp);
        payload.append('uf', uf);
        payload.append('city', city);
        payload.append('latitude', String(latitude));
        payload.append('longitude', String(longitude));
        payload.append('items', items.join(','));

        if(image) {
            payload.append('image', image)
        }

        await api.post('points', payload).then(response => {
           const statusCode = response.status;
           if(statusCode === 201) {
               const id = response.data.id;
               alert("Ponto de coleta com ID: " + String(id) + " criado");
               history.push('/');
           } else {
               alert("Falhou na criação")
           }
        });
    }

    return (
        <div id="page-create-point">
            <header>
                <img src={logo} alt="Ecoleta"/>
                <Link to='/'>
                    <FiArrowLeft /> Voltar Para a home
                </Link>
            </header>
            <form onSubmit={handleSubmit}>
                <h1>Cadastro do <br /> ponto de coleta</h1>

                <Dropzone onFileUploaded={setSelectedFile}/>

                <fieldset>
                    <legend>
                        <h2>Dados</h2>
                    </legend>
                    <div className="field">
                        <label htmlFor="name">Nome da entidade</label>
                        <input
                            type="text"
                            name="name"
                            id="name"
                            onChange={handleInputChange}
                        />
                    </div>
                    <div className="field-group">
                        <div className="field">
                            <label htmlFor="email">E-mail</label>
                            <input
                                type="email"
                                name="email"
                                id="email"
                                onChange={handleInputChange}
                            />
                        </div>
                        <div className="field">
                            <label htmlFor="whatsapp">Whatsapp</label>
                            <input
                                type="text"
                                name="whatsapp"
                                id="whatsapp"
                                onChange={handleInputChange}
                            />
                        </div>
                    </div>
                </fieldset>

                <fieldset>
                    <legend>
                        <h2>Endereço</h2>
                        <span>Selecione o endereço no mapa</span>
                    </legend>
                    <Map center={currentPosition} zoom={15} onClick={handleMapLocalization}>
                        <TileLayer
                            attribution='&amp;copy <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
                            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                        />
                        <Marker position={selectedPosition} />
                    </Map>
                    <div className="field-group">
                        <div className="field">
                            <label htmlFor="uf">Estado</label>
                            <select
                                name="uf"
                                id="uf"
                                value={selectedUF}
                                onChange={handleUfChange}>

                                <option value="0">Selecione um Estado</option>
                                {states.map(state => (
                                    <option key={state.id} value={state.sigla}>{state.sigla}</option>
                                ))}
                            </select>
                        </div>
                        <div className="field">
                            <label htmlFor="city">Cidade</label>
                            <select
                                name="city"
                                id="city"
                                value={selectedCity}
                                onChange={handleCityChange}>

                                <option value="0">Selecione uma cidade</option>
                                {cities.map(city => (
                                    <option key={city.id} value={city.nome}>{city.nome}</option>
                                ))}
                            </select>
                        </div>
                    </div>
                </fieldset>

                <fieldset>
                    <legend>
                        <h2>Ítens de coleta</h2>
                        <span>Selecione um ou mais ítens abaixo</span>
                    </legend>
                    <ul className="items-grid">
                        {items.map(item => (
                            <li
                                key={item.id}
                                onClick={() => handleSelectItem(item.id)}
                                className={selectedItems.includes(item.id) ? 'selected' : ''}
                            >
                                <img src={item.image_url} alt={item.title} />
                                <span>{item.title}</span>
                            </li>
                        ))}
                    </ul>
                </fieldset>
                <button type="submit">
                    Cadastrar ponto de coleta
                </button>
            </form>
        </div>
    );
}

export default CreatePoint;