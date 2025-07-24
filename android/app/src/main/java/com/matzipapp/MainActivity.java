package com.melog.app;

import com.facebook.react.ReactActivity;
import android.os.Bundle;
import com.facebook.react.ReactActivityDelegate;
import com.facebook.react.defaults.DefaultNewArchitectureEntryPoint;
import com.facebook.react.defaults.DefaultReactActivityDelegate;

//하단바 아이콘 색상 설정 위한 요소
import android.os.Build;
import android.view.View;
import android.view.Window;

public class MainActivity extends ReactActivity {

  /**
   * Returns the name of the main component registered from JavaScript. This is used to schedule
   * rendering of the component.
   */
  @Override
  protected String getMainComponentName() {
    return "melog";
  }

  /**
   * Returns the instance of the {@link ReactActivityDelegate}. Here we use a util class {@link
   * DefaultReactActivityDelegate} which allows you to easily enable Fabric and Concurrent React
   * (aka React 18) with two boolean flags.
   */
  @Override
  protected ReactActivityDelegate createReactActivityDelegate() {
    return new DefaultReactActivityDelegate(
        this,
        getMainComponentName(),
        // If you opted-in for the New Architecture, we enable the Fabric Renderer.
        DefaultNewArchitectureEntryPoint.getFabricEnabled());
  }

  @Override
  protected void onCreate(Bundle savedInstanceState) {
    super.onCreate(null);

  // 하단바 아이콘 색상 설정
    if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {
    Window window = getWindow();
    window.getDecorView().setSystemUiVisibility(
      View.SYSTEM_UI_FLAG_LIGHT_NAVIGATION_BAR
    );
  }
  }
}
