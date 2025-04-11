/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Class.java to edit this template
 */
package clusteretl;

/**
 *
 * @author Tomi
 */
public class Band {
    public static void main(String[] args) {

  
}

public static String returnBand(String freq1) {
    

    double frequency = Double.parseDouble(freq1.replace(":", ""));
                                                         if (frequency >= 1800 && frequency <= 1900 ) {
                                                    	  return "160M";
                                                      }
                                                     
                                                      if (frequency >= 3500 && frequency <= 3700 ) {
                                                    	  return "80M";
                                                      }
                                                      
                                                      if (frequency >= 5300 && frequency <= 5500 ) {
                                                    	  return "60M";
                                                      }
                                                      
                                                      if (frequency >= 7000 && frequency <= 7200 ) {
                                                    	  return "40M";
                                                      }
                                                      
                                                      if (frequency >= 10100 && frequency <= 10150 ) {
                                                    	  return "30M";
                                                      }
                                                      
                                                      if (frequency >= 14000 && frequency <= 14500 ) {
                                                    	  return "20M";
                                                      }
                                                      
                                                      if (frequency >= 18000 && frequency <= 19000 ) {
                                                    	  return "17M";
                                                      }
                                                      
                                                      if (frequency >= 21000 && frequency <= 21500 ) {
                                                    	  return "15M";
                                                      }
                                                      
                                                      if (frequency >= 24890 && frequency <= 24990 ) {
                                                    	  return "12M";
                                                      }
                                                      
                                                      if (frequency >= 28000 && frequency <= 28500 ) {
                                                    	  return "10M";
                                                      }
                                                      
                                                      if (frequency >= 50000 && frequency <= 51500 ) {
                                                    	  return "6M";
                                                      }
                                                      
                                                      if (frequency >= 144000 && frequency <= 146000 ) {
                                                    	  return "2M";
                                                      }
                                                     
                                                     return "none";
    
    
}
}
