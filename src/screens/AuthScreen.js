import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, Alert, ScrollView, KeyboardAvoidingView, Platform } from 'react-native';
import { useApexStore } from '../store/apexStore';

export default function AuthScreen() {
  const { userProfile, security, setProfile, setPin, unlockApp } = useApexStore();
  
  // Setup State
  const [name, setName] = useState('');
  const [age, setAge] = useState('');
  const [height, setHeight] = useState('');
  const [weight, setWeight] = useState('');
  const [targetWeight, setTargetWeight] = useState('');
  const [setupPin, setSetupPin] = useState('');
  
  // Login State
  const [enteredPin, setEnteredPin] = useState('');

  const handleInitialSetup = () => {
    if (!name || !age || !height || !weight || !targetWeight || setupPin.length < 4) {
      Alert.alert("INCOMPLETE DATA", "All biometric parameters and a 4-digit PIN are required to calculate your protocol.");
      return;
    }
    
    // Pass everything to the store to be tailored
    setProfile({ 
        name, 
        age: parseInt(age), 
        height: parseFloat(height), 
        startingWeight: parseFloat(weight), 
        targetWeight: parseFloat(targetWeight) 
    });
    setPin(setupPin);
  };

  if (!userProfile.isSetupComplete) {
    return (
      <KeyboardAvoidingView style={{flex: 1, backgroundColor: '#000'}} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        <ScrollView contentContainerStyle={styles.scrollContainer}>
          <Text style={styles.title}>INITIALIZE APEX</Text>
          <Text style={styles.sub}>ENTER BIOMETRICS TO TAILOR PROTOCOL</Text>
          
          <TextInput style={styles.input} placeholder="OPERATOR NAME" placeholderTextColor="#444" value={name} onChangeText={setName} />
          
          <View style={styles.row}>
            <TextInput style={[styles.input, {flex: 1, marginRight: 10}]} placeholder="AGE" placeholderTextColor="#444" keyboardType="number-pad" value={age} onChangeText={setAge} />
            <TextInput style={[styles.input, {flex: 1}]} placeholder="HEIGHT (CM)" placeholderTextColor="#444" keyboardType="decimal-pad" value={height} onChangeText={setHeight} />
          </View>

          <View style={styles.row}>
            <TextInput style={[styles.input, {flex: 1, marginRight: 10}]} placeholder="CURRENT WT (KG)" placeholderTextColor="#444" keyboardType="decimal-pad" value={weight} onChangeText={setWeight} />
            <TextInput style={[styles.input, {flex: 1}]} placeholder="TARGET WT (KG)" placeholderTextColor="#444" keyboardType="decimal-pad" value={targetWeight} onChangeText={setTargetWeight} />
          </View>

          <TextInput style={styles.input} placeholder="SET 4-DIGIT SECURE PIN" placeholderTextColor="#444" keyboardType="number-pad" secureTextEntry maxLength={4} value={setupPin} onChangeText={setSetupPin} />
          
          <TouchableOpacity style={styles.btn} onPress={handleInitialSetup}>
            <Text style={styles.btnText}>CALCULATE & ESTABLISH PROFILE</Text>
          </TouchableOpacity>
        </ScrollView>
      </KeyboardAvoidingView>
    );
  }

  return (
    <View style={styles.loginContainer}>
      <Text style={[styles.title, {marginBottom: 10}]}>LOCKED</Text>
      <Text style={styles.sub}>ENTER AUTHORIZATION PIN</Text>
      <TextInput 
        style={[styles.input, {textAlign: 'center', fontSize: 32, letterSpacing: 10}]} 
        keyboardType="number-pad"
        secureTextEntry
        autoFocus
        maxLength={4}
        value={enteredPin}
        onChangeText={(val) => {
          setEnteredPin(val);
          if (val.length === 4) {
            if (val === security.pin) unlockApp();
            else { Alert.alert("DENIED", "Incorrect PIN."); setEnteredPin(''); }
          }
        }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  scrollContainer: { flexGrow: 1, justifyContent: 'center', padding: 30 },
  loginContainer: { flex: 1, backgroundColor: '#000', justifyContent: 'center', alignItems: 'center', padding: 40 },
  title: { color: '#fff', fontSize: 28, fontWeight: '900', letterSpacing: 3, marginBottom: 5 },
  sub: { color: '#f39c12', fontSize: 10, fontWeight: 'bold', marginBottom: 30, letterSpacing: 1 },
  input: { backgroundColor: '#111', color: '#fff', width: '100%', padding: 18, borderRadius: 8, borderWidth: 1, borderColor: '#222', marginBottom: 15, fontSize: 14, fontWeight: 'bold' },
  row: { flexDirection: 'row', width: '100%' },
  btn: { backgroundColor: '#f39c12', paddingVertical: 18, borderRadius: 8, marginTop: 10, alignItems: 'center' },
  btnText: { color: '#000', fontWeight: '900', letterSpacing: 1 }
});