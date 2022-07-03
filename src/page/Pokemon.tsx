import React, { useEffect, useState, useCallback } from 'react';
import './pokemon.css';
import axios from 'axios';
import { pokemon } from '../interface/interface';

import PokemonList from './PokemonList';

interface pokemons {
  name: string;
  url: string;
}
export interface Detail {
  id: number;
  isOpened: boolean;
}
const Pokemon: React.FC = () => {
  const [pokemon, setPokemon] = useState<pokemon[]>([]);
  const [nextUrl, setNextUrl] = useState<string>('');
  const [loadPage, setLoadPage] = useState<boolean>(true);
  const [viewDetail, setDetail] = useState<Detail>({
    id: 0,
    isOpened: false,
  });
  useEffect(() => {
    const getPokemon = async () => {
      const res = await axios.get('https://pokeapi.co/api/v2/pokemon?limit=20&offset=20');
      setNextUrl(res.data.next);

      res.data.results.forEach(async (pokemon: pokemons) => {
        const poke = await axios.get(`https://pokeapi.co/api/v2/pokemon/${pokemon.name}`);
        setPokemon((prev) => [...prev, poke.data]);
      });
      setLoadPage(false);
    };
    getPokemon();
  }, []);

  const nextPage = async () => {
    setLoadPage(true);
    const res = await axios.get(nextUrl);
    res.data.results.forEach(async (pokemon: pokemons) => {
      const poke = await axios.get(`https://pokeapi.co/api/v2/pokemon/${pokemon.name}`);
      setPokemon((prev) => [...prev, poke.data]);
    });
    setLoadPage(false);
  };

  const selectPokemon = (id: number) => {
    if (!viewDetail.isOpened) {
      setDetail({
        id: id,
        isOpened: true,
      });
    }
  };

  return (
    <div className="container">
      <section className={viewDetail.isOpened ? 'collection-container-active' : 'collection-container'}>
        {viewDetail.isOpened ? <div className="overlay"></div> : <div className=""></div>}
        {pokemon.map((item, index) => {
          return (
            <div className="" onClick={() => selectPokemon(item.id)}>
              <PokemonList
                viewDetail={viewDetail}
                setDetail={setDetail}
                name={item.name}
                id={item.id}
                image={item.sprites.front_default}
                abilities={item.abilities}
              />
            </div>
          );
        })}
      </section>
      {!viewDetail.isOpened && (
        <div className="btn">
          <button onClick={nextPage}>{loadPage ? 'Loading...' : 'Load more'}</button>
        </div>
      )}
    </div>
  );
};

export default React.memo(Pokemon);
