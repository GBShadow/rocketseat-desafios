import { useContext, useEffect } from "react";
import { createContext, ReactNode, useState } from "react";
import { api } from "../services/api";
export interface GenreResponseProps {
  id: number;
  name: "action" | "comedy" | "documentary" | "drama" | "horror" | "family";
  title: string;
}

export interface MovieProps {
  imdbID: string;
  Title: string;
  Poster: string;
  Ratings: Array<{
    Source: string;
    Value: string;
  }>;
  Runtime: string;
}

interface MoviesProviderProps {
  children: ReactNode;
}

interface MoviesContextData {
  selectedGenre: GenreResponseProps;
  genres: GenreResponseProps[];
  movies: MovieProps[];
  selectedGenreId: number;
  handleClickButton: (id: number) => void;
}

const MoviesContext = createContext<MoviesContextData>({} as MoviesContextData);

const MoviesProvider = ({ children }: MoviesProviderProps) => {
  const [selectedGenreId, setSelectedGenreId] = useState(1);
  const [genres, setGenres] = useState<GenreResponseProps[]>([]);
  const [movies, setMovies] = useState<MovieProps[]>([]);
  const [selectedGenre, setSelectedGenre] = useState<GenreResponseProps>(
    {} as GenreResponseProps
  );

  useEffect(() => {
    api.get<GenreResponseProps[]>("genres").then((response) => {
      setGenres(response.data);
    });
  }, []);

  useEffect(() => {
    api
      .get<MovieProps[]>(`movies/?Genre_id=${selectedGenreId}`)
      .then((response) => {
        setMovies(response.data);
      });

    api
      .get<GenreResponseProps>(`genres/${selectedGenreId}`)
      .then((response) => {
        setSelectedGenre(response.data);
      });
  }, [selectedGenreId]);

  function handleClickButton(id: number) {
    setSelectedGenreId(id);
  }

  return (
    <MoviesContext.Provider
      value={{
        movies,
        selectedGenre,
        genres,
        selectedGenreId,
        handleClickButton,
      }}
    >
      {children}
    </MoviesContext.Provider>
  );
};

function useMovies(): MoviesContextData {
  const context = useContext(MoviesContext);

  if (!context) {
    throw new Error("useMovies must be used within an MoviesProvider");
  }

  return context;
}

export { useMovies, MoviesProvider };
