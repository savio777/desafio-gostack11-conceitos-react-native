import React, { useState, useEffect } from "react";

import {
  SafeAreaView,
  View,
  FlatList,
  Text,
  StatusBar,
  StyleSheet,
  TouchableOpacity,
} from "react-native";

import api from "./services/api";

export default function App() {
  const [repositories, setRepositories] = useState([]);

  useEffect(() => {
    async function getRepositories() {
      const response = await api.get("/repositories");

      setRepositories(response.data);
    }

    getRepositories();
  }, []);

  async function handleLikeRepository(id, index) {
    const response = await api.post(`/repositories/${id}/like`);

    if (response.status == 200) {
      const repos = repositories;

      repos[index].likes += 1;

      setRepositories([...repos]);
    }
  }

  const renderRepo = (repository, index) => (
    <View style={styles.repositoryContainer}>
      <Text style={styles.repository}>{repository.title}</Text>

      <View style={styles.techsContainer}>
        {repository.techs
          ? repository.techs.length > 0 &&
            repository.techs.map((tech) => (
              <Text style={styles.tech}>{tech}</Text>
            ))
          : null}
      </View>

      <View style={styles.likesContainer}>
        <Text
          style={styles.likeText}
          // Remember to replace "1" below with repository ID: {`repository-likes-${repository.id}`}
          testID={`repository-likes-${repository.id}`}
        >
          {repository.likes > 1
            ? `${repository.likes} curtidas`
            : `${repository.likes} curtida`}
        </Text>
      </View>

      <TouchableOpacity
        style={styles.button}
        onPress={() => handleLikeRepository(repository.id, index)}
        // Remember to replace "1" below with repository ID: {`like-button-${repository.id}`}
        testID={`like-button-${repository.id}`}
      >
        <Text style={styles.buttonText}>Curtir</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <>
      <StatusBar barStyle="light-content" backgroundColor="#7159c1" />
      <SafeAreaView style={styles.container}>
        <FlatList
          keyExtractor={(item) => item.id}
          data={repositories}
          renderItem={({ item, index }) => renderRepo(item, index)}
        />
      </SafeAreaView>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#7159c1",
  },
  repositoryContainer: {
    marginBottom: 15,
    marginHorizontal: 15,
    backgroundColor: "#fff",
    padding: 20,
  },
  repository: {
    fontSize: 32,
    fontWeight: "bold",
  },
  techsContainer: {
    flexDirection: "row",
    marginTop: 10,
  },
  tech: {
    fontSize: 12,
    fontWeight: "bold",
    marginRight: 10,
    backgroundColor: "#04d361",
    paddingHorizontal: 10,
    paddingVertical: 5,
    color: "#fff",
  },
  likesContainer: {
    marginTop: 15,
    flexDirection: "row",
    justifyContent: "space-between",
  },
  likeText: {
    fontSize: 14,
    fontWeight: "bold",
    marginRight: 10,
  },
  button: {
    marginTop: 10,
  },
  buttonText: {
    fontSize: 14,
    fontWeight: "bold",
    marginRight: 10,
    color: "#fff",
    backgroundColor: "#7159c1",
    padding: 15,
  },
});
