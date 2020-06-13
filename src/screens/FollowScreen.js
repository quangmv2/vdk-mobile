import React, { useState, useEffect } from "react";
import { View, StyleSheet, Text, Alert, ScrollView, StatusBar } from "react-native";
import gql from 'graphql-tag';
import { useSubscription, useQuery } from "@apollo/react-hooks";
import * as Location from 'expo-location';

const onListenData = gql`
    subscription getData{
        listenData {
            temperature
            humidity
        }
    }
`
const getHello = gql`
    query getHello{
        hello
    }
`

const FollowScreen = (props) => {

    const { data, loading, error } = useSubscription(onListenData);
    const [location, setLocation] = useState(null);
    const [errorMsg, setErrorMsg] = useState(null);
    // const { data, loading } = useQuery(getHello);

    // Alert.alert(JSON.stringify(data))


    useEffect(() => {
        (async () => {
          let { status } = await Location.requestPermissionsAsync();
          if (status !== 'granted') {
            setErrorMsg('Permission to access location was denied');
          }
          let location = await Location.getCurrentPositionAsync({});
          setLocation(location);
        })();
    });

    let text = 'Waiting..';
    if (errorMsg) {
      text = errorMsg;
    } else if (location) {
      text = JSON.stringify(location);
    }

    const getDate = (timestamp) => {
        const dateTime = new Date(timestamp);
        const dateStr = `${dateTime.getHours()<10?'0' +dateTime.getHours():dateTime.getHours()}:${dateTime.getMinutes()<10?'0' +dateTime.getMinutes():dateTime.getMinutes()}:${dateTime.getSeconds()<10?'0' +dateTime.getSeconds():dateTime.getSeconds()}`
        return dateStr;
    }

    return (
        <View style={styles.contanier}>
            <StatusBar barStyle="dark-content" />
            <Text style={styles.title}>{location?getDate(location.timestamp):''}</Text>
            {/* <Text style={styles.title}>{text}</Text> */}
            <Text style={styles.title}>Nhiệt độ</Text>
            <Text style={styles.value}>{loading?'Waiting...':data.listenData.temperature + '°C'}</Text>
            <Text style={styles.title}>Độ ẩm</Text>
            <Text style={styles.value}>{loading?'Waiting...':data.listenData.humidity + '%'}</Text>
        </View>
    );
}

export default FollowScreen;

const styles = StyleSheet.create({
    contanier: {
        flex: 1,
        backgroundColor: '#fff',
        alignItems: 'center',
        justifyContent: 'center',
    },
    title: {
        fontSize: 50,
        padding: 10
    },
    value: {
        fontSize: 30,
        padding: 5
    }
});