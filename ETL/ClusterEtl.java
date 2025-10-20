/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package clusteretl;

import java.io.*;
import java.util.TimeZone;
import java.util.Date;
import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.net.*;
import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.sql.Statement;
import java.util.logging.Level;
import java.util.logging.Logger;
import java.util.Properties;
import java.sql.Time;
/**
 *
 * @author Tomi kallio
 */
public class ClusterEtl {
 
	
    public static void main(String[] args) throws IOException, ParseException 
    {
    	int timeOutnumber = 0;
    	// loop structure for timeout cases. 
    	 while (true){
             
    	String clusteraddress = "telnet.reversebeacon.net";
       	String call = "OH2BBT";
    	String Sqluser = "cluster";
    	String Sqlpass = "Saturnus1!";
    	String Postgresql_address = "192.168.1.39:5432";
    	String DataBase = "postgres";
    	String skimmerName = "OH2BBT";
        String ModeFilter = "xx";
    	int iport = 7000;
    	// File configFile = new File("src/clusteretl/config.properties");
        File configFile = new File("address.properties");

    	try {
    		FileReader reader = new FileReader(configFile);
    		Properties props = new Properties();
    		props.load(reader);
   		clusteraddress = props.getProperty("address");
                 System.out.println(clusteraddress);
                 String port = props.getProperty("port");
    		call = props.getProperty("call");
    		iport = Integer.parseInt(port);
    		Postgresql_address = props.getProperty("postgresql_address");
    		DataBase = props.getProperty("postgresql_db");
    		Sqluser = props.getProperty("postgresql_user");
    		Sqlpass = props.getProperty("postgresql_password");
    		skimmerName= props.getProperty("skimmer_name");
            ModeFilter= props.getProperty("modefilter");
    		reader.close();
    	} catch (FileNotFoundException ex) {
    		// file does not exist
    		System.out.println("conf file not found");
    	}
           
        String S_N = null;
        String band = null;
        boolean newfile = false ;
        String host = clusteraddress;
     
  //log file initialization
                           PrintWriter s_out = null;
                           BufferedReader s_in = null;
                           File file =new File("cluster_" + host + ".txt");
                           //if file does'nt exists, then create it
                           if(!file.exists()){
                        	    newfile = true;
                        	       file.createNewFile();
                           }
                           FileWriter fileWritter = new FileWriter(file.getName(),true);
                           BufferedWriter bufferWritter = new BufferedWriter(fileWritter);
   // write header if file not exits
        if(newfile) {
        	 bufferWritter.write("decall;dxcall;freq;band;S/N;datetime;country;continent;mode;decontinent;dxcontinent;de_country;skimmode");
             bufferWritter.newLine();
             bufferWritter.flush();
        }
        //telnet connection  
        boolean Ce = false;
        Socket s = new Socket();
        try 
        {
            s.connect(new InetSocketAddress(host , iport));
            System.out.println("Connected ");
                                                                                  
          //writer for socket
            s_out = new PrintWriter( s.getOutputStream(), true);
            //reader for socket
            s_in = new BufferedReader(new InputStreamReader(s.getInputStream()));
        }
            
        //Host not found
        catch (UnknownHostException e) 
        {
            System.err.println("Don't know about host : " + host);
            System.exit(1);
        }
       
        catch (ConnectException ce)
             {
            	  Ce = true;
        	System.err.println("excp " + ce);
            Date date = new Date();
            bufferWritter.write("ConnectException  " + date);
             bufferWritter.newLine();
             bufferWritter.flush();
            try {
        		  Thread.sleep(10000L);	  // 10 second
        		}
        		catch (Exception e) {}
        }
        // keep going if connection is ok
        if (!Ce) {
    	try
		{	
			s.setSoTimeout (1200000);
		}
		catch (SocketException se)
		{
			System.err.println ("Unable to set socket option SO_TIMEOUT");
		}
     
        //Send message to server
    	
                           String message = call;
                           s_out.println( message );
                           System.out.println("Message sent");
                           System.out.println(s_in.readLine());
                           //Get response from server
                           String response;
                          // while (true){
                                                      Connection con = null;
                                                      Statement st = null;
                                                      ResultSet rs = null;
                                                      PreparedStatement pst = null;
                                                      String pattern = "yyyy-MM-dd HH:mm";
                                                      SimpleDateFormat simpleDateFormat = new SimpleDateFormat(pattern);
                                                      simpleDateFormat.setTimeZone(TimeZone.getTimeZone("UTC")); 
                                                      String datetime = simpleDateFormat.format(new Date());
                                                      //date time format change
                                                    //  SimpleDateFormat sdf = new SimpleDateFormat("yyyy-MM-dd HH:mm");
                                                    //  java.util.Date newdate = sdf.parse(datetime);
                                                       //date time format change end
                                                      String url = "jdbc:postgresql://";
                                                      url = url + Postgresql_address + "/" + DataBase ;
                                                      String user = Sqluser;
                                                      String password = Sqlpass;
                                                      String DXcountry ="";
                                                      try{
                                                       con = DriverManager.getConnection(url, user, password);
                                                      }
                                                      catch (SQLException ex) {
                                                          Logger lgr = Logger.getLogger(ClusterEtl.class.getName());
                                                          lgr.log(Level.SEVERE, ex.getMessage(), ex);
                                                          System.out.print(ex.getMessage() + "\n");
                                                      }
                           try
                           {
                           while ((response = s_in.readLine()) != null) 
                           {		
                               {
                        	 
                     	
                                                      if (response.startsWith("DX")) {
                                                          try {
                                                            String Mode = response.substring(38,(response.length()-7)).trim()  ;
                                                              if (Mode.matches("(.*)" + ModeFilter + "(.*)")) {
                                                                                                        }
                                                              else {
                                                      //parsing columns  
                                                      long now = System.currentTimeMillis();
                                                     // java.sql.Timestamp sqlDate = new Timestamp(now);
                                                      Time sqlTime = new Time(now);
                                                      String decallin = (response.substring(5, 16)).trim();
                                                      String decall_trimmed = decallin.replaceAll("[#:-]","");
                                                      String prefixdecall = "="+decall_trimmed;
                                                      String dxcall = response.substring((response.length()-50), (response.length()-37)).trim();
                                                      String prefixdxcall = "="+dxcall;
                                                      String de_country = "";
                                                      String finaldxcontinent = "";
                                                      String decontinent = "";
                                                      String finaldecontinent = decontinent.replace("ll","");
                                                      String freqString= response.substring((response.length()-60), (response.length()-51));
                                                      double freq = Double.parseDouble(freqString.replace(":", ""));
                                                      String info = response.substring(38,(response.length()-7)).trim();
                                                      info = "  " + info;
                                                      S_N = info.substring((info.indexOf("dB")-3), (info.indexOf("dB"))).trim();
                                                      String Skimmode = null;
                                                      if (info.matches("(.*)CQ(.*)")) {
                                                    	  Skimmode ="CQ";
                                                     }
                                                       if (info.matches("(.*)DE(.*)")) {
                                                    	  Skimmode ="DE";
                                                     }
                                                      String mode = null;
                                                      if (info.matches("(.*)WPM(.*)")) {
                                                    	   mode ="CW";
                                                      }
                                                      if (info.matches("(.*)RTTY(.*)")) {
                                                   	   mode ="RTTY";
                                                     }
                                                      if (info.matches("(.*)PSK31(.*)")) {
                                                   	   mode ="PSK31";
                                                     }
                                                      if (info.matches("(.*)PSK63(.*)")) {
                                                   	   mode ="PSK63";
                                                     }
                                                      if (info.matches("(.*)PSK100(.*)")) {
                                                   	   mode ="PSK100";
                                                     }
                                                      if (info.matches("(.*)PSK125(.*)")) {
                                                   	   mode ="PSK125";
                                                        }
                                                     if (info.matches("(.*)FT8(.*)")) {
                                                          mode ="FT8";
                                                        }
                                                     if (info.matches("(.*)FT4(.*)")) {
                                                          mode ="FT4";
                                                        }
                                                     band = Band.returnBand(freqString);
                                                    
                                                     // PostregSQL routines
                                                                                                                                                  
                                                     try {
                                                          st = con.createStatement(); 
                                                          //ResultSet rs1 = st.executeQuery ("select country,continent from(SELECT  country,continent,length(prefix) FROM cluster.dxcc where '"+dxcall+"' like concat(dxcc.prefix, '%') order by 3 desc limit 1) as foo");
                                                          ResultSet rs1 = st.executeQuery ("select * from(select country,continent from(SELECT  country,continent,length(prefix) FROM cluster.dxcc where '"+prefixdxcall+"' = dxcc.prefix order by 3 desc limit 1)union select country,continent from(SELECT  country,continent,length(prefix) FROM cluster.dxcc where '"+dxcall+"' like concat(dxcc.prefix, '%') order by 3 desc limit 1) limit 1) as foo");
                                                         while (rs1.next())
                                                         {
                                                            DXcountry = rs1.getString(1);
                                                            finaldxcontinent = rs1.getString(2);
                                                         } rs1.close();
                                                         //ResultSet rs2 = st.executeQuery ("select country,continent from(SELECT  country,continent,length(prefix) FROM cluster.dxcc where '"+decall_trimmed+"' like concat(dxcc.prefix, '%') order by 3 desc limit 1) as foo");
                                                         ResultSet rs2 = st.executeQuery ("select * from(select country,continent from(SELECT  country,continent,length(prefix) FROM cluster.dxcc where '"+prefixdecall+"' = dxcc.prefix order by 3 desc limit 1)union select country,continent from(SELECT  country,continent,length(prefix) FROM cluster.dxcc where '"+decall_trimmed+"' like concat(dxcc.prefix, '%') order by 3 desc limit 1) limit 1) as foo");
                                                         while (rs2.next())
                                                         {
                                                          de_country = rs2.getString(1);
                                                            finaldecontinent = rs2.getString(2);
                                                         } rs2.close();
                                                         st.close();
                                                                                   
                                                    // write line to log file      
                                                    //bufferWritter.write(decall_trimmed + ";" + dxcall + ";" + freq + ";" + band + ";" + S_N + ";" + datetime + ";" + country_2 +";" + mode +";" +decontinent +";" +dxcontinent +";" +de_country +";" + Skimmode);
                                                    //bufferWritter.newLine();
                                                    // bufferWritter.write(response);
                                                    // bufferWritter.newLine();
                                                    // bufferWritter.flush();
                                                    // System.out.println( response );
                                                    // write line
                                                    
                                                      
                                                      System.out.print("  " +  sqlTime+ " de " + decall_trimmed + "\t" + freq + "\t" + dxcall + "\t" + S_N + " db"+ "\t" + mode + "\t" + band + "\t" + DXcountry.trim() + "\n");
                                                                                                                                                                                                                      
                                                          String stm = "INSERT INTO cluster.clustertable(title, decall, dxcall, freq, band,sig_noise, country, mode, de_continent, dx_continent, de_country, skimmode) VALUES(?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)";
                                                          pst = con.prepareStatement(stm);
                                                          pst.setString(1, skimmerName);
                                                          pst.setString(2, decall_trimmed);
                                                          pst.setString(3, dxcall); 
                                                          pst.setDouble(4, freq);
                                                          pst.setString(5, band);
                                                          pst.setString(6, S_N);
                                                          pst.setString(7, DXcountry);
                                                          pst.setString(8, mode);
                                                          pst.setString(9, finaldecontinent);
                                                          pst.setString(10, finaldxcontinent);
                                                          pst.setString(11, de_country);
                                                          pst.setString(12, Skimmode);
                                                          pst.executeUpdate();
                                                                                              
                                                      } catch (SQLException ex) {
                                                          Logger lgr = Logger.getLogger(ClusterEtl.class.getName());
                                                          lgr.log(Level.SEVERE, ex.getMessage(), ex);
                                                          System.out.print(ex.getMessage() + "\n");

                                                      } 
                                                     finally {
                                                          try {
                                                              if (rs != null) {
                                                                  rs.close();
                                                              }
                                                              if (st != null) {
                                                                  st.close();
                                                              }
                                                              if (con != null) {
                                                                //  con.close();
                                                              }

                                                          } catch (SQLException ex) {
                                                              Logger lgr = Logger.getLogger(ClusterEtl.class.getName());
                                                              lgr.log(Level.WARNING, ex.getMessage(), ex);
                                                          }
                                                      }
                                            //PostregSQL routines end
                                                             } 
                                                      }
                                                         catch (Exception ex) {
                                                          Logger lgr = Logger.getLogger(ClusterEtl.class.getName());
                                                          lgr.log(Level.SEVERE, ex.getMessage(), ex);
                                                          System.out.print(ex.getMessage() + "\n");

                                                      }  
                                                      
                           }
                           }
                           
                           }
                           }
                           catch (InterruptedIOException iioe)
                           {
                        	  timeOutnumber++;
                        	   System.out.println (timeOutnumber);
                               System.out.println ("Timeout occurred ");
                        	   System.out.println (iioe);
                                    bufferWritter.write( datetime +" Timeout occurred");
                        	   //close the i/o streams
                               s_out.close();
                               s_in.close();
                                                                                      
                               //close the socket
                              s.close();
                          	   bufferWritter.close();
                        	  

                           }
                           catch (SocketException iioe)
                           {
                        	  timeOutnumber++;
                        	   System.out.println (timeOutnumber);
                        	   System.out.println ("SocketException ");
                        	   //close the i/o streams
                               s_out.close();
                               s_in.close();
                                                                                      
                               //close the socket
                              s.close();
                          	   bufferWritter.close();
                          	   System.out.println("30 second wait");
                          	 try {
                          		  Thread.sleep(30000L);	  // 30 second
                          		}
                          		catch (Exception e) {}

                           }
           
                           System.out.println ("connections killed");
       
                           }
           	 }
                           }
    
    
}
