import React, { useContext, useEffect, useState } from "react";
import { ScrollView, Image, Text, View, StyleSheet, TouchableOpacity } from "react-native";
import { Feather } from '@expo/vector-icons';
import firestore from "@react-native-firebase/firestore";
import { UserContext } from "../contexts/useUser";
import { AntDesign } from '@expo/vector-icons';

// Objetos de imagens
import { hotelImages, PontoTuristicoImages, pacoteImages, commerceImages } from "../utils/globalConts";

// Novo componente FavoriteCard
function FavoriteCard({ nome, descricao, onRemove, imageURIs }) {
  return (
    <View style={styles.card}>
      <Image style={styles.cardImage} source={imageURIs[0]} />
      <View style={styles.textContainer}>
        <Text style={styles.cardTitle}>{nome}</Text>
        <Text numberOfLines={3} ellipsizeMode="tail" style={styles.cardText}>
          {descricao}
        </Text>
      </View>
      <TouchableOpacity style={styles.heartButton} onPress={onRemove}>
        <AntDesign name="heart" size={24} color="#0D4BF2" />
      </TouchableOpacity>
    </View>
  );
}

export function Profile() {
  const { user, userInformations, handleSignOut, toggleFavorite } = useContext(UserContext);
  const [hoteis, setHoteis] = useState([]);
  const [pontosTuristicos, setPontosTuristicos] = useState([]);
  const [comercio, setcomercio] = useState([]);
  const [pacotes, setpacotes] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    !loading && setLoading(true);
    firestore()
      .collection('hoteis')
      .get()
      .then((querySnapshot) => {
        const hoteis = [];
        querySnapshot.forEach((documentSnapshot) => {
          userInformations.favorites.forEach((favorite) => {
            if (favorite === documentSnapshot.data().nome_hot) {
              hoteis.push(documentSnapshot.data());
            }
          });
        });
        setHoteis(hoteis);
        setLoading(false);
      });
  }, [userInformations.favorites]);

  // Novo useEffect para carregar informações de pontos turísticos
  useEffect(() => {
    !loading && setLoading(true);
    firestore()
      .collection('pontos_turisticos')
      .get()
      .then((querySnapshot) => {
        const pontosTuristicos = [];
        querySnapshot.forEach((documentSnapshot) => {
          pontosTuristicos.push(documentSnapshot.data());
        });
        setPontosTuristicos(pontosTuristicos);
        setLoading(false);
      });
  }, []);

  useEffect(() => {
    !loading && setLoading(true);
    firestore()
      .collection('centros_comerciais')
      .get()
      .then((querySnapshot) => {
        const comercio = [];
        querySnapshot.forEach((documentSnapshot) => {
          comercio.push(documentSnapshot.data());
        });
        setcomercio(comercio);
        setLoading(false);
      });
  }, []);

  useEffect(() => {
    !loading && setLoading(true);
    firestore()
      .collection('pacotes_viagem')
      .get()
      .then((querySnapshot) => {
        const pacotes = [];
        querySnapshot.forEach((documentSnapshot) => {
          pacotes.push(documentSnapshot.data());
        });
        setpacotes(pacotes);
        setLoading(false);
      });
  }, []);

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.header}>
        <View style={styles.userInfo}>
          <Image
            style={styles.image}
            source={{ uri: user.photoURL }}
          />
          <Text style={styles.username}>{user.displayName}</Text>
        </View>
        <TouchableOpacity style={styles.buttonLogout} onPress={handleSignOut}>
          <Feather name="log-out" size={20} color="white" />
          <Text style={styles.logoutText}>Sair</Text>
        </TouchableOpacity>
      </View>
      {!loading && userInformations.favorites.length > 0 && (
        userInformations.favorites.map((favorite, index) => {
          const favoriteData = hoteis.find(hotel => hotel.nome_hot === favorite);

          if (favoriteData) {
            return (
              <FavoriteCard
                key={index}
                nome={favoriteData.nome_hot}
                descricao={favoriteData.descricao_hot}
                imageURIs={hotelImages[favoriteData.nome_hot]}
                onRemove={() => toggleFavorite(favoriteData.nome_hot)}
              />
            );
          }
          return null;
        })
      )}

      {!loading && userInformations.favorites.length > 0 && (
        userInformations.favorites.map((favorite, index) => {
          const favoriteData = pontosTuristicos.find(pontosTuristicos => pontosTuristicos.nome_ptur === favorite);

          if (favoriteData) {
            return (
              <FavoriteCard
                key={index}
                nome={favoriteData.nome_ptur}
                descricao={favoriteData.descricao_ptur}
                imageURIs={PontoTuristicoImages[favoriteData.nome_ptur]}
                onRemove={() => toggleFavorite(favoriteData.nome_ptur)}
              />
            );
          }
          return null;
        })
      )}

      {!loading && userInformations.favorites.length > 0 && (
        userInformations.favorites.map((favorite, index) => {
          const favoriteData = comercio.find(comercio => comercio.nome_comer === favorite);

          if (favoriteData) {
            return (
              <FavoriteCard
                key={index}
                nome={favoriteData.nome_comer}
                descricao={favoriteData.descricao_comer}
                imageURIs={commerceImages[favoriteData.nome_comer]}
                onRemove={() => toggleFavorite(favoriteData.nome_comer)}
              />
            );
          }
          return null;
        })
      )}

      {!loading && userInformations.favorites.length > 0 && (
        userInformations.favorites.map((favorite, index) => {
          const favoriteData = pacotes.find(pacotes => pacotes.hotel_pct === favorite);

          if (favoriteData) {
            return (
              <FavoriteCard
                key={index}
                nome={favoriteData.hotel_pct}
                descricao={favoriteData.agencia}
                imageURIs={pacoteImages[favoriteData.hotel_pct]}
                onRemove={() => toggleFavorite(favoriteData.hotel_pct)}
              />
            );
          }
          return null;
        })
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'white',
    flexGrow: 1,
    alignItems: 'flex-start',
    justifyContent: 'flex-start',
    padding: 20,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between', // Alinha os elementos à esquerda e à direita
  },
  userInfo: {
    flexDirection: 'row',
    alignItems: 'center', // Centraliza verticalmente
  },
  textContainer: {
    flex: 1, // Ocupa todo o espaço vertical
    marginLeft: 16,
  },
  image: {
    width: 55,
    height: 55,
    borderRadius: 50,
  },
  username: {
    color: 'black',
    fontSize: 20,
    lineHeight: 18,
    textAlign: 'left',
    marginLeft: 10,
  },
  buttonLogout: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#147DEB',
    borderRadius: 10,
    padding: 10,
    marginLeft: 109,
  },
  logoutText: {
    color: 'white',
    fontSize: 16,
    marginLeft: 10,
  },
  // Estilos do FavoriteCard
  card: {
    flexDirection: 'row',
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 16,
    marginBottom: 16,
    marginTop: 15,
    borderWidth: 1,
    borderColor: '#0D4BF2',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 1,
  },
  cardImage: {
    width: 104, // Largura da imagem
    height: 148, // Altura da imagem
    borderRadius: 10, // Raio
    overflow: 'hidden', // Para garantir que a imagem seja cortada com o raio
  },
  textContainer: {
    flex: 1,
    marginLeft: 16,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8,
    color: 'black',
  },
  cardText: {
    fontSize: 16,
    marginBottom: 8,
    color: 'black',
  },
});
