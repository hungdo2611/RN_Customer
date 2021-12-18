package com.hd.customer;
import android.content.Intent;
import android.os.Bundle;

import androidx.annotation.Nullable;

import org.devio.rn.splashscreen.SplashScreen;


import com.reactnativenavigation.NavigationActivity;
public class MainActivity extends NavigationActivity {
    @Override
    protected void onCreate(@Nullable Bundle savedInstanceState) {
        SplashScreen.show(this);
        super.onCreate(savedInstanceState);

    }

    @Override
    public void onNewIntent(Intent intent) {
        super.onNewIntent(intent);
    }
}
