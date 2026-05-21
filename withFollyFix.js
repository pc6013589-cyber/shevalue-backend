const { withDangerousMod } = require('@expo/config-plugins');
const fs = require('fs');
const path = require('path');

const withFollyFix = (config) => {
  return withDangerousMod(config, [
    'ios',
    async (config) => {
      const podfilePath = path.join(config.modRequest.platformProjectRoot, 'Podfile');
      let podfile = fs.readFileSync(podfilePath, 'utf8');
      const follyFix = [
        '  installer.pods_project.targets.each do |target|',
        '    target.build_configurations.each do |cfg|',
        "      cfg.build_settings['GCC_PREPROCESSOR_DEFINITIONS'] ||= ['$(inherited)', '_LIBCPP_ENABLE_CXX17_REMOVED_UNARY_BINARY_FUNCTION']",
        "      cfg.build_settings['CLANG_CXX_LANGUAGE_STANDARD'] = 'c++17'",
        '    end',
        '  end'
      ].join('\n');
      if (!podfile.includes('CLANG_CXX_LANGUAGE_STANDARD')) {
        podfile = podfile.replace(
          'post_install do |installer|',
          'post_install do |installer|\n' + follyFix
        );
        fs.writeFileSync(podfilePath, podfile);
      }
      return config;
    },
  ]);
};

module.exports = withFollyFix;
