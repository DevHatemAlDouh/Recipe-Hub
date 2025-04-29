import React from "react";
import { View, Text, Image, StyleSheet, ScrollView, TouchableOpacity, SafeAreaView } from "react-native";
import { useLocalSearchParams } from "expo-router";
import { BackHandler } from 'react-native';
import { useFocusEffect, router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

const RecipeDetails = () => {
  const params = useLocalSearchParams();
  const parsedRecipe = params.recipe ? JSON.parse(params.recipe) : null;

  // Handlers
  // const handleShare = () => {/* منطق المشاركة */};
  // const handleFavorite = () => {/* منطق المفضلة */};

  useFocusEffect(
    React.useCallback(() => {
      const onBackPress = () => {
        router.back();
        return true;
      };

      BackHandler.addEventListener('hardwareBackPress', onBackPress);
      return () => 
        BackHandler.removeEventListener('hardwareBackPress', onBackPress);
    }, [])
  );

  if (!parsedRecipe) {
    return (
      <View style={styles.errorContainer}>
        <Ionicons name="sad-outline" size={48} color="#888" />
        <Text style={styles.errorText}>Recipe Not Found </Text>
      </View>
    );
  }

  return (
    <SafeAreaView style={{ flex: 1 }}>
        <ScrollView style={[styles.container, { backgroundColor: "rgba(255, 182, 93, 0.47)" }, ]}>
            {/* قسم الصورة */}
            <View style={styles.header}>
                {parsedRecipe.image ? (
                <Image 
                    source={require('@/assets/images/alyona-yankovska-AlrHfEvOexw-unsplash.jpg')} 
                    style={styles.image}
                    resizeMode="cover"
                    onError={() => console.log("خطأ في تحميل الصورة")}
                />
                ) : (
                <View style={styles.imagePlaceholder}>
                    <Ionicons name="image-outline" size={50} color="#ced6e0" />
                    <Text style={styles.placeholderText}>لا توجد صورة متاحة</Text>
                </View>
                )}
                
                {/* <View style={styles.actionsRow}>
                <TouchableOpacity onPress={handleFavorite} style={styles.iconButton}>
                    <Ionicons name="heart-outline" size={28} color="#fff" />
                </TouchableOpacity>
                <TouchableOpacity onPress={handleShare} style={styles.iconButton}>
                    <Ionicons name="share-social-outline" size={28} color="#fff" />
                </TouchableOpacity>
                </View> */}
            </View>

            {/* معلومات الوصفة الأساسية */}
            <View style={styles.recipeMeta}>
                <View style={styles.metaItem}>
                <Ionicons name="people-outline" size={28} color="#e17055" />
                <Text style={styles.metaValue}>{parsedRecipe.serves || 4}</Text>
                <Text style={styles.metaLabel}>أفراد</Text>
                </View>

                {/* <View style={styles.metaItem}>
                <Ionicons name="time-outline" size={28} color="#e17055" />
                <Text style={styles.metaValue}>{parsedRecipe.cookingTime || 30}</Text>
                <Text style={styles.metaLabel}>دقيقة</Text>
                </View> */}

                <View style={styles.metaItem}>
                <Ionicons name="flame-outline" size={28} color="#e17055" />
                <Text style={styles.metaValue}>{parsedRecipe.difficulty || 'متوسط'}</Text>
                <Text style={styles.metaLabel}>التصنيف</Text>
                </View>
            </View>

            {/* محتوى الوصفة */}
            <View style={styles.content}>
                <Text style={styles.title}>{parsedRecipe.title}</Text>
                
                <View style={styles.authorContainer}>
                <Ionicons name="person-circle-outline" size={20} color="#636e72" />
                <Text style={styles.authorText}>{parsedRecipe.author}</Text>
                </View>

                {/* قسم المكونات */}
                <View style={styles.section}>
                <Text style={styles.sectionTitle}>المكونات</Text>
                <View style={styles.ingredientsGrid}>
                    {parsedRecipe.ingredients?.map((ingredient, index) => (
                    <View key={index} style={styles.ingredientItem}>
                        <View style={styles.bullet} />
                        <Text style={styles.ingredientText}>{ingredient}</Text>
                    </View>
                    ))}
                </View>
                </View>

                {/* خطوات التحضير */}
                <View style={styles.section}>
                <Text style={styles.sectionTitle}>طريقة التحضير</Text>
                {parsedRecipe.steps?.map((step, index) => (
                    <View key={index} style={styles.stepContainer}>
                    <View style={styles.stepNumber}>
                        <Text style={styles.stepNumberText}>{index + 1}</Text>
                    </View>
                    <Text style={styles.stepText}>{step}</Text>
                    </View>
                ))}
                </View>
            </View>
        </ScrollView>
    </SafeAreaView>
    
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  errorText: {
    fontSize: 18,
    color: '#888',
    marginTop: 10,
  },
  header: {
    position: 'relative',
    marginBottom: 20,
  },
  image: {
    width: "100%",
    height: 320,
    borderBottomLeftRadius: 40,
    borderBottomRightRadius: 40,
  },
  imagePlaceholder: {
    width: "100%",
    height: 320,
    backgroundColor: "#f8f9fa",
    justifyContent: "center",
    alignItems: "center",
    borderBottomLeftRadius: 40,
    borderBottomRightRadius: 40,
  },
  placeholderText: {
    color: "#ced6e0",
    fontSize: 16,
    marginTop: 10,
  },
  actionsRow: {
    position: 'absolute',
    top: 50,
    right: 25,
    flexDirection: 'row',
    gap: 20,
  },
  iconButton: {
    backgroundColor: 'rgba(0,0,0,0.25)',
    padding: 12,
    borderRadius: 30,
  },
  recipeMeta: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginVertical: 25,
    paddingHorizontal: 15,
  },
  metaItem: {
    alignItems: 'center',
    padding: 10,
    backgroundColor: '#fff',
    borderRadius: 15,
    width: 100,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  metaValue: {
    fontSize: 22,
    fontWeight: '700',
    color: '#2d3436',
    marginVertical: 5,
  },
  metaLabel: {
    fontSize: 14,
    color: '#636e72',
  },
  content: {
    paddingHorizontal: 25,
    paddingBottom: 50,
  },
  title: {
    fontSize: 32,
    fontWeight: '800',
    color: '#2d3436',
    textAlign: 'right',
    lineHeight: 40,
    marginBottom: 15,
  },
  authorContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 30,
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  authorText: {
    fontSize: 16,
    color: '#636e72',
  },
  section: {
    marginBottom: 35,
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: '#2d3436',
    textAlign: 'right',
    marginBottom: 20,
    paddingBottom: 10,
    borderBottomWidth: 2,
    borderBottomColor: '#e17055',
  },
  ingredientsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    gap: 15,
  },
  ingredientItem: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '48%',
    marginBottom: 12,
    padding: 12,
    backgroundColor: '#f8f9fa',
    borderRadius: 10,
  },
  bullet: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#e17055',
    marginHorizontal: 8,
  },
  ingredientText: {
    fontSize: 16,
    color: '#2d3436',
    flex: 1,
    textAlign: 'right',
  },
  stepContainer: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 15,
    marginBottom: 20,
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 15,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 6,
  },
  stepNumber: {
    width: 35,
    height: 35,
    borderRadius: 20,
    backgroundColor: '#e17055',
    justifyContent: 'center',
    alignItems: 'center',
  },
  stepNumberText: {
    color: '#fff',
    fontWeight: '700',
    fontSize: 16,
  },
  stepText: {
    fontSize: 16,
    color: '#2d3436',
    flex: 1,
    textAlign: 'right',
    lineHeight: 24,
  },
});

export default RecipeDetails;