import { Movies } from './components/Movies';
import { useMovies } from './hooks/useMovies';
import { useEffect, useRef, useState, useCallback } from 'react';
import debounce from 'just-debounce-it';
import './App.css';

function useSearch() {
	const [search, updateSearch] = useState('');
	const [error, setError] = useState(null);
	const isFirstInput = useRef(true);

	useEffect(() => {
		if (isFirstInput.current) {
			isFirstInput.current = search === '';
			return;
		}
		if (search === '') {
			setError('No se puede buscar una película vacía');
			return;
		}

		if (search.length < 3) {
			setError('La búsqueda debe tener al menos 3 caracteres');
			return;
		}

		setError(null);
	}, [search]);

	return { search, updateSearch, error };
}

function App() {
	const [sort, setSort] = useState(false);
	const { search, updateSearch, error } = useSearch();
	const { movies, getMovies, loading } = useMovies({ search, sort });

	const debouncedGetMovies = useCallback(
		debounce(search => {
			getMovies({ search });
		}, 300),
		[getMovies]
	);

	const handleSubmit = event => {
		event.preventDefault();
		getMovies({ search });
	};

	const handleSort = () => {
		setSort(!sort);
	};

	const handleChange = event => {
		const newSearch = event.target.value;
		updateSearch(newSearch);
		debouncedGetMovies(newSearch);
	};

	return (
		<div className='page'>
			<header>
				<h1>Buscador de películas</h1>
				<form className='form' onSubmit={handleSubmit}>
					<input
						name='query'
						onChange={handleChange}
						value={search}
						placeholder='Avengers, matrix...'
					/>
					<input type='checkbox' onChange={handleSort} checked={sort} />
					<button>Buscar</button>
				</form>
				{error && <p style={{ color: 'red' }}>{error}</p>}
			</header>

			<main>{loading ? <p>Loading...</p> : <Movies movies={movies} />}</main>
		</div>
	);
}

export default App;
