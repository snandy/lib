<%@ page language="java" import="java.util.*" pageEncoding="UTF-8"%>
<%@page import="com.fel.util.*"%>
<%
ImagePreview img = new ImagePreview();
out.write(img.ProcessRequest(request));
%>

