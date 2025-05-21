import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  Image,
  Alert,
  ActivityIndicator,
} from "react-native";
import * as ImagePicker from "expo-image-picker";
import { useRouter, useLocalSearchParams } from "expo-router";
import axios from "axios";
import * as FileSystem from "expo-file-system";
import NetInfo from "@react-native-community/netinfo";

const StepsSection = () => {
  const [steps, setSteps] = useState([
    {
      text: "",
      image: null,
      imageBase64: "",
      isSubmitting: false,
      error: null,
    },
  ]);
  const [overallLoading, setOverallLoading] = useState(false);
  const [shouldStopSubmission, setShouldStopSubmission] = useState(false);
  const router = useRouter();

  const params = useLocalSearchParams();
  const recipeId = params.recipeId;
  const title = params.title;

  const convertImageToBase64 = async (uri) => {
    try {
      const base64 = await FileSystem.readAsStringAsync(uri, {
        encoding: FileSystem.EncodingType.Base64,
      });
      return base64;
    } catch (error) {
      console.error("Error converting image:", error);
      throw new Error("Failed to process image");
    }
  };

  const pickStepImage = async (index) => {
    try {
      let result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: [ImagePicker.MediaType.IMAGE],
        allowsEditing: true,
        aspect: [4, 3],
        quality: 0.7,
        base64: true,
        selectionLimit: 1,
      });
      if (!result.canceled && result.assets && result.assets.length > 0) {
        const uri = result.assets[0].uri;
        const base64Image = await convertImageToBase64(uri);

        const updatedSteps = [...steps];
        updatedSteps[index] = {
          ...updatedSteps[index],
          image: uri,
          imageBase64: base64Image,
          error: null,
        };
        setSteps(updatedSteps);
      }
    } catch (error) {
      console.error("Error picking image:", error);
      const updatedSteps = [...steps];
      updatedSteps[index].error = "فشل في اختيار الصورة";
      setSteps(updatedSteps);
    }
  };

  const addStep = () => {
    setSteps([
      ...steps,
      {
        text: "",
        image: null,
        imageBase64: "",
        isSubmitting: false,
        error: null,
      },
    ]);
  };

  const updateStepText = (index, text) => {
    const updatedSteps = [...steps];
    updatedSteps[index] = {
      ...updatedSteps[index],
      text: text,
      error: null,
    };
    setSteps(updatedSteps);
  };

  const deleteStep = (index) => {
    if (steps.length > 1) {
      const updatedSteps = steps.filter((_, i) => i !== index);
      setSteps(updatedSteps);
    } else {
      Alert.alert("خطأ", "يجب أن تحتوي الوصفة على خطوة واحدة على الأقل");
    }
  };

  const handleSubmitSteps = async () => {
    const hasEmptySteps = steps.some((step) => !step.text.trim());
    if (hasEmptySteps) {
      const updatedSteps = steps.map((step) => ({
        ...step,
        error: !step.text.trim() ? "يرجى كتابة وصف الخطوة" : null,
      }));
      setSteps(updatedSteps);
      Alert.alert("خطأ", "يرجى كتابة وصف لكل خطوة");
      return;
    }

    setOverallLoading(true);
    setShouldStopSubmission(false);

    try {
      for (let i = 0; i < steps.length; i++) {
        if (shouldStopSubmission) break;

        let retries = 3;
        let success = false;

        while (retries > 0 && !success && !shouldStopSubmission) {
          try {
            success = await submitSingleStep(steps[i], i);
            if (!success) {
              retries--;
              if (retries === 0) {
                setShouldStopSubmission(true);
                Alert.alert(
                  "فشل الإرسال",
                  `فشل في إضافة الخطوة ${i + 1} بعد 3 محاولات.`,
                  [
                    {
                      text: "متابعة",
                      onPress: () => setShouldStopSubmission(false),
                      style: "cancel",
                    },
                    {
                      text: "إيقاف الإرسال",
                      onPress: () => {},
                      style: "destructive",
                    },
                  ]
                );
              }
            }
          } catch (error) {
            console.error(
              `المحاولة ${4 - retries} فشلت للخطوة ${i + 1}:`,
              error
            );
            retries--;
            if (retries === 0) {
              setShouldStopSubmission(true);
            }
          }
        }
      }

      if (!shouldStopSubmission) {
        Alert.alert("تم", "تمت إضافة جميع الخطوات بنجاح!", [
          {
            text: "العودة للرئيسية",
            onPress: () => {
              setSteps([
                {
                  text: "",
                  image: null,
                  imageBase64: "",
                  isSubmitting: false,
                  error: null,
                },
              ]);
              router.replace("/(tabs)/Home");
            },
          },
        ]);
      }
    } catch (error) {
      console.error("خطأ أثناء الإرسال:", error);
      Alert.alert("خطأ", "حدث خطأ غير متوقع. حاول مرة أخرى.");
    } finally {
      setOverallLoading(false);
    }
  };

  const submitSingleStep = async (step, index) => {
    const updatedSteps = [...steps];

    try {
      const isConnected = await NetInfo.fetch().then(
        (state) => state.isConnected
      );
      if (!isConnected) {
        throw new Error("لا يوجد اتصال بالإنترنت");
      }

      updatedSteps[index] = {
        ...updatedSteps[index],
        isSubmitting: true,
        error: null,
      };
      setSteps(updatedSteps);

      const stepData = {
        recipeID: recipeId,
        stepNumber: index + 1,
        description: step.text.trim(),
        backgroundImage: step.imageBase64,
      };

      const response = await axios.post(
        "http://recipe-hub.runasp.net/api/Steps/Add",
        stepData,
        {
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
          },
          timeout: 30000,
        }
      );

      if (response.status !== 204) {
        throw new Error(`رمز الاستجابة من الخادم: ${response.status}`);
      }

      updatedSteps[index] = {
        ...updatedSteps[index],
        isSubmitting: false,
        error: null,
      };
      setSteps(updatedSteps);

      return true;
    } catch (error) {
      console.error(`خطأ في إرسال الخطوة ${index + 1}:`, error);

      let errorMessage = "فشل في إضافة الخطوة. حاول مرة أخرى.";
      if (
        error.message === "Network Error" ||
        error.message === "لا يوجد اتصال بالإنترنت"
      ) {
        errorMessage = "خطأ في الشبكة. تحقق من اتصالك بالإنترنت.";
      } else if (error.response?.data?.errors) {
        errorMessage = Object.values(error.response.data.errors).join(", ");
      } else if (error.response?.data?.message) {
        errorMessage = error.response.data.message;
      } else if (error.message) {
        errorMessage = error.message;
      }

      updatedSteps[index] = {
        ...updatedSteps[index],
        isSubmitting: false,
        error: errorMessage,
      };
      setSteps(updatedSteps);

      throw error;
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>أضف خطوات الوصفة: {title}</Text>

      {steps.map((step, index) => (
        <View key={index} style={styles.stepContainer}>
          <View style={styles.stepHeader}>
            <Text style={styles.stepNumber}>الخطوة {index + 1}</Text>
            {steps.length > 1 && (
              <TouchableOpacity
                style={styles.deleteStepButton}
                onPress={() => deleteStep(index)}
                disabled={step.isSubmitting || overallLoading}
              >
                <Text style={styles.deleteStepButtonText}>حذف</Text>
              </TouchableOpacity>
            )}
          </View>

          <TextInput
            style={[
              styles.input,
              styles.multilineInput,
              step.error && !step.text.trim() && styles.errorInput,
            ]}
            placeholder={`وصف الخطوة ${index + 1}`}
            value={step.text}
            onChangeText={(text) => updateStepText(index, text)}
            multiline
            editable={!step.isSubmitting && !overallLoading}
            placeholderTextColor="#B0B0B0"
          />

          {step.error && !step.text.trim() && (
            <Text style={styles.errorText}>{step.error}</Text>
          )}

          <TouchableOpacity
            style={styles.imagePickerButton}
            onPress={() => pickStepImage(index)}
            disabled={step.isSubmitting || overallLoading}
          >
            {step.isSubmitting ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text style={styles.imagePickerText}>
                {step.image ? "تغيير صورة الخطوة" : "إضافة صورة (اختياري)"}
              </Text>
            )}
          </TouchableOpacity>

          {step.image && (
            <Image source={{ uri: step.image }} style={styles.stepImage} />
          )}

          {step.error && step.text.trim() && (
            <Text style={styles.errorText}>{step.error}</Text>
          )}
        </View>
      ))}

      <TouchableOpacity
        style={styles.addStepButton}
        onPress={addStep}
        disabled={overallLoading}
      >
        <Text style={styles.addStepButtonText}>إضافة خطوة جديدة</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={[styles.submitButton, overallLoading && styles.disabledButton]}
        onPress={handleSubmitSteps}
        disabled={overallLoading || steps.some((step) => step.isSubmitting)}
      >
        {overallLoading ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <Text style={styles.submitButtonText}>
            حفظ جميع الخطوات ({steps.length})
          </Text>
        )}
      </TouchableOpacity>

      {shouldStopSubmission && (
        <Text style={styles.stopAlertText}>
          تم إيقاف الإرسال بسبب وجود أخطاء. يرجى مراجعة الخطوات الفاشلة
          والمحاولة مرة أخرى.
        </Text>
      )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    padding: 20,
    backgroundColor: "#f5f5f5",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
    textAlign: "center",
    color: "#6B5B95",
  },
  input: {
    backgroundColor: "#fff",
    padding: 15,
    borderRadius: 10,
    marginBottom: 15,
    fontSize: 16,
    borderWidth: 1,
    borderColor: "#ddd",
  },
  multilineInput: {
    height: 100,
    textAlignVertical: "top",
  },
  errorInput: {
    borderColor: "#dc3545",
  },
  errorText: {
    color: "#dc3545",
    marginBottom: 10,
    fontSize: 14,
    textAlign: "right",
  },
  stepContainer: {
    marginBottom: 20,
    backgroundColor: "#fff",
    padding: 15,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#ddd",
    shadowColor: "#6B5B95",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.07,
    shadowRadius: 4,
    elevation: 2,
  },
  stepHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 10,
  },
  stepNumber: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#6B5B95",
  },
  deleteStepButton: {
    backgroundColor: "#dc3545",
    padding: 8,
    borderRadius: 5,
  },
  deleteStepButtonText: {
    color: "#fff",
    fontSize: 14,
  },
  imagePickerButton: {
    backgroundColor: "#6B5B95",
    padding: 15,
    borderRadius: 10,
    alignItems: "center",
    marginBottom: 15,
  },
  imagePickerText: {
    color: "#fff",
    fontSize: 16,
  },
  stepImage: {
    width: "100%",
    height: 150,
    borderRadius: 10,
    marginBottom: 15,
    resizeMode: "cover",
  },
  addStepButton: {
    backgroundColor: "#ffc107",
    padding: 15,
    borderRadius: 10,
    alignItems: "center",
    marginBottom: 15,
  },
  addStepButtonText: {
    color: "#000",
    fontSize: 16,
    fontWeight: "bold",
  },
  submitButton: {
    backgroundColor: "#28a745",
    padding: 15,
    borderRadius: 10,
    alignItems: "center",
  },
  disabledButton: {
    backgroundColor: "#6c757d",
  },
  submitButtonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
  },
  stopAlertText: {
    color: "#dc3545",
    textAlign: "center",
    marginTop: 10,
    fontSize: 15,
    fontWeight: "500",
  },
});

export default StepsSection;
