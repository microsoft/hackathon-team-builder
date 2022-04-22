using Newtonsoft.Json;
using NUnit.Framework;
using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using TeamBuilder.Serverless.Services;

namespace TeamBuilder.Serverless.Tests
{
    public class TestPermissionLevelStringEnumConverter
    {
        private PermissionLevelStingEnumJsonConverter _permissionLevelConverter;
        private string _sampleRequestJson;

        [SetUp]
        public void Setup()
        {
            _permissionLevelConverter = new PermissionLevelStingEnumJsonConverter();
            _sampleRequestJson = File.ReadAllText("TestData/githubteampayload.json");
        }

        [Test]
        public void TestCustomConverterShouldParsePermissionLevel()
        {
            Team req = JsonConvert.DeserializeObject<Team>(_sampleRequestJson, _permissionLevelConverter);

            Assert.AreEqual("pull", req.Permission.StringValue);
        }
    }
}
